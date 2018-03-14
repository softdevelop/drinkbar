# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models import F
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import force_text
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from categories.base import CategoryBase
from django.urls import reverse
from facepy import GraphAPI
from datetime import datetime, date
import api_utils
from django.utils import timezone
class DrinkCategory(CategoryBase):
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'),null=True, blank=True, upload_to='categories')

    def get_absolute_url(self):
        """Return a path"""
        from django.core.urlresolvers import NoReverseMatch

        try:
            prefix = reverse('categories_tree_list')
        except NoReverseMatch:
            prefix = '/'
        ancestors = list(self.get_ancestors()) + [self, ]
        return prefix + '/'.join([force_text(i.name) for i in ancestors]) + '/'

    def get_main_level(self):
        from django.core.urlresolvers import NoReverseMatch

        try:
            prefix = reverse('categories_tree_list')
        except NoReverseMatch:
            prefix = '/'
        ancestors = list(self.get_ancestors()) + [self, ]
        return prefix + '/'.join([force_text(ancestors[0].id)])

class UserBase(AbstractUser):
    email = models.EmailField(_('email address'), blank=True, unique=True)
    birthday = models.DateField(null=True, blank=True)
    avatar = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='avatars',
                                 null=True, blank=True)
    avatar_url = models.CharField(max_length=200, null=True, blank=True)
    opt = models.CharField(max_length=255, null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    fb_uid = models.CharField(max_length=200, null=True, blank=True)
    fb_access_token = models.CharField(max_length=1000, null=True, blank=True)

    @property
    def full_name(self):
        return u'{} {}'.format(self.first_name,self.last_name)

    @property
    def token(self):
        return self.auth_token.key

    @classmethod
    def get_or_create_user_from_facebook(self, fb_token, should_create=True):
        new_user = UserBase()
        try:
            graph = GraphAPI(fb_token)
            user = graph.get("me?fields=id,email,first_name,last_name,birthday")

            fb_uid = user.get('id')
            email = user.get('email')
            first_name = user.get('first_name', '')
            last_name = user.get('last_name', '')
            birthday = user.get('birthday', '')
            birthday = datetime.strptime(birthday, '%m/%d/%Y')
            avatar_url = "http://graph.facebook.com/%s/picture?width=500&height=500&type=square" % fb_uid
            new_user = UserBase.objects.get(username=email,fb_uid=fb_uid)
            if not new_user:
                new_user = UserBase(username=email, email=email,fb_uid=fb_uid,
                            first_name=first_name,last_name=last_name,
                            birthday=birthday.date(),avatar_url=avatar_url,
                            fb_access_token=unicode(fb_token).encode('utf-8'))
                new_user.save()
            # ret = self.update_user_data(ret, username, email, first_name, last_name,
                                        # gender, relationship_status, about, dob, avatar_url)
        except Exception as e:
            print ">>> get_or_create_user_from_facebook ::", e
            pass
        return new_user

@receiver(post_save, sender=UserBase)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class SeparateGlass(models.Model):
    CONST_UNIT_ML = 0
    CONST_UNIT_OZ = 10

    CONST_UNIT = (
        (CONST_UNIT_ML, _('mL')),
        (CONST_UNIT_OZ, _('oz')),
    )
    name = models.CharField(max_length=200)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='glass')
    size = models.PositiveIntegerField(help_text=_('mL'))
    unit = models.SmallIntegerField(choices=CONST_UNIT, default=CONST_UNIT_ML)  

    @property
    def change_to_ml(self):
        if self.unit is self.CONST_UNIT_OZ:
            return self.size*29.57
        return self.size

    def __unicode__(self):
        return self.name

class Ingredient(models.Model):
    CONST_STATUS_ENABLED = 0
    CONST_STATUS_BLOCKED = 10

    CONST_STATUSES = (
        (CONST_STATUS_ENABLED, _('On')),
        (CONST_STATUS_BLOCKED, _('Off')),
    )

    status = models.PositiveSmallIntegerField(_('status'), choices=CONST_STATUSES,
                                              default=CONST_STATUS_ENABLED)
    type = models.CharField(max_length=200, blank=True, null= True)
    name = models.CharField(max_length=200)
    price = models.FloatField(blank=True, null= True, default=1)
    bottles = models.PositiveIntegerField(blank=True, null=True, default=0)
    quanlity_of_bottle = models.PositiveIntegerField(help_text=_('mL'), default=0)
    brand = models.CharField(max_length=200, blank=True, null= True)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='ingredient', null=True, blank=True)
    def __unicode__(self):
        return "-".join([self.name, "".join([str(self.quanlity_of_bottle), "mL"])])


class Garnish(models.Model):
    name = models.CharField(max_length=200, unique=True)
    active = models.BooleanField(default=True)
    def __unicode__(self):
        return self.name

class DrinkType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='drink-type', null=True, blank=True)
    def __unicode__(self):
        return self.name

class Drink(models.Model):

    name = models.CharField(max_length=200)
    type = models.ForeignKey(DrinkType, blank=True, null=True)
    category = models.ForeignKey(DrinkCategory, blank=True, null=True)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='drink')
    numbers_bought = models.PositiveIntegerField(blank=True, null= True, default=0)
    price = models.FloatField(blank=True, null=True)
    glass = models.ForeignKey(SeparateGlass,blank=True, null=True)
    key_word = models.CharField(max_length=200, blank=True, null=True)
    estimate_time = models.PositiveIntegerField(help_text=_('seconds'), default=0)
    is_have_ice = models.BooleanField(default=True)
    
    def __unicode__(self):
        return self.name

class DrinkIngredient(models.Model):
    CONST_UNIT_PART = 0
    CONST_UNIT_ML = 10

    CONST_UNIT = (
        (CONST_UNIT_PART, _('Part')),
        (CONST_UNIT_ML, _('mL')),
    )

    drink = models.ForeignKey(Drink, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient)
    ratio = models.FloatField(help_text=_('part'))
    unit = models.PositiveSmallIntegerField(choices=CONST_UNIT, default=CONST_UNIT_PART)

class DrinkGarnish(models.Model):
    drink = models.ForeignKey(Drink, related_name='garnishes')
    garnish = models.ForeignKey(Garnish)
    ratio = models.FloatField(help_text=_('pcs'))


class Order(models.Model):
    CHANNEL_PAYPAL = 1
    CHANNEL_STRIPE = 2
    CHANNELS = (
        (CHANNEL_PAYPAL, _('PayPal')),
        (CHANNEL_STRIPE, _('Stripe')),
    )
    STATUS_NEW = 0
    STATUS_PROCESSING = 10
    STATUS_FINISHED = 20
    STATUS_TOOK = 30
    STATUS_NOT_TAKE = 40
    STATUSES = (
        (STATUS_NEW, _("New")),
        (STATUS_PROCESSING, _("Processing")),
        (STATUS_FINISHED, _("Finished")),
        (STATUS_TOOK, _("Took")),
        (STATUS_NOT_TAKE, _("Not take")),
    )

    status = models.SmallIntegerField(choices=STATUSES, default=STATUS_NEW, null=True, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(UserBase, related_name='orders')
    amount = models.FloatField(blank=True, null=True)
    channel = models.SmallIntegerField(choices=CHANNELS, null=True, blank=True)
    transaction_code = models.CharField(max_length=300, null=True, blank=True)
    transaction_id = models.CharField(max_length=50, null=True, blank=True)
    payer_firstname = models.CharField(max_length=50, null=True, blank=True)
    payer_lastname = models.CharField(max_length=50, null=True, blank=True)
    payer_email = models.CharField(max_length=100, null=True, blank=True)
    line_taking = models.SmallIntegerField(null=True, blank=True)

class Tab(models.Model):

    CONST_NO_ICE = 0
    CONST_50_ICE = 10
    CONST_100_ICE = 20

    CONST_ICE_CHOICE = (
        (CONST_NO_ICE, _('No Ice')),
        (CONST_50_ICE, _('50% Ice')),
        (CONST_100_ICE, _('100% Ice')),
    )

    user = models.ForeignKey(UserBase, related_name='tab')
    drink = models.ForeignKey(Drink)
    ice = models.PositiveSmallIntegerField(_('ice'), choices=CONST_ICE_CHOICE, 
                                        default=CONST_100_ICE)
    garnish = models.ManyToManyField(Garnish, blank =True)
    quantity = models.PositiveIntegerField(blank=True, null= True, default=0)
    order = models.ForeignKey(Order, related_name='products')

class Robot(models.Model):
    STATUS_ENABLE = 0
    STATUS_DISABLAE = 10

    CONST_STATUSES = (
        (STATUS_ENABLE, _('Turn on')),
        (STATUS_DISABLAE, _('Turn off')),
    )

    status = models.PositiveSmallIntegerField(choices=CONST_STATUSES, 
                                        default=STATUS_DISABLAE)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return u'Robot-{}'.format(self.id)

class RobotIngredient(models.Model):

    robot = models.ForeignKey(Robot, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient)
    remain_of_bottle = models.PositiveIntegerField(help_text=_('mL'), default=0)


class IngredientHistory(models.Model):
    CONST_STATUS_IMPORT= 0
    CONST_STATUS_EXPORT = 10

    CONST_STATUSES = (
        (CONST_STATUS_IMPORT, _('Import')),
        (CONST_STATUS_EXPORT, _('Export to machine')),
    )

    creation_date = models.DateTimeField(auto_now_add=True)
    status = models.PositiveSmallIntegerField(_('status'), choices=CONST_STATUSES)
    machine = models.ForeignKey(Robot, related_name='ingredient_histories',null=True, blank=True)
    ingredient = models.ForeignKey(Ingredient, related_name='histories')
    quantity = models.PositiveIntegerField(default=1)

@receiver(post_save, sender=IngredientHistory)
def create_ingredient_history(sender, instance=None, created=False, **kwargs):
    if created:
        if instance.status is IngredientHistory.CONST_STATUS_IMPORT:
            instance.ingredient.bottles += instance.quantity
        else:
            instance.ingredient.bottles -= instance.quantity
        instance.ingredient.save()
    '''
        Not suppor update, change data, quantity, 
            must delete and add again!
    '''

@receiver(post_delete, sender=IngredientHistory)
def delete_ingredient_history(sender, instance=None, created=False, **kwargs):
    if instance.status is IngredientHistory.CONST_STATUS_IMPORT:
        instance.ingredient.bottles -= instance.quantity
    else:
        instance.ingredient.bottles += instance.quantity
    instance.ingredient.save()


