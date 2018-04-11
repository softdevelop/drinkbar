# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models import F, Sum
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import force_text
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from categories.base import CategoryBase
from django.urls import reverse
from facepy import GraphAPI
from datetime import datetime, date
from . import api_utils
import facebook
import urllib
import fpformat
from django.utils import timezone
from django.conf import settings
from collections import Counter


class UserBase(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    birthday = models.DateField()
    avatar = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='avatars',
                                 null=True, blank=True)
    avatar_url = models.CharField(max_length=200, null=True, blank=True, default=settings.MEDIA_URL+'avatar_defautl.png')
    opt = models.CharField(max_length=255, null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    fb_uid = models.CharField(max_length=200, null=True, blank=True)
    fb_access_token = models.CharField(max_length=1000, null=True, blank=True)
    favorite_drink = models.ManyToManyField("Drink",related_name="favorite_by")

    @property
    def full_name(self):
        return u'{} {}'.format(self.first_name,self.last_name)

    @property
    def token(self):
        return self.auth_token.key
    @property
    def qr_code(self):
        datetime_format = '%Y-%m-%d %H:%M:%S'
        # today = (self.last_login).strftime(datetime_format)
        data = u'User:{} {} Id:{}'.format(self.first_name, self.last_name, self.id)
        data = urllib.quote_plus(data)
        return u'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={}'.format(data)

    @classmethod
    def get_or_create_user_from_facebook(self, fb_token, should_create=True):
        new_user = UserBase()
        try:
            graph = facebook.GraphAPI(access_token=fb_token,version=2.11)
            user = graph.get_object(id="me",fields="email, first_name, last_name, birthday")

            fb_uid = user.get('id')
            email = user.get('email')
            first_name = user.get('first_name', '')
            last_name = user.get('last_name', '')
            birthday = user.get('birthday', '')
            birthday = datetime.strptime(birthday, '%m/%d/%Y')
            avatar_url = "http://graph.facebook.com/%s/picture?width=500&height=500&type=square" % fb_uid
            new_user = self.objects.filter(username=email,fb_uid=fb_uid).first()
            if not new_user:
                new_user = UserBase(username=email, email=email, fb_uid=fb_uid,
                            first_name=first_name, last_name=last_name, is_email_verified=True,
                            birthday=birthday.date(), avatar_url=avatar_url,
                            fb_access_token=unicode(fb_token).encode('utf-8'))
                new_user.save()
            else:
                # Update user information if it was changed.
                self.objects.filter(username=email,fb_uid=fb_uid).update(first_name=first_name,
                            last_name=last_name, birthday=birthday.date(),
                            fb_access_token=unicode(fb_token).encode('utf-8'))
        except Exception as e:
            print (">>> get_or_create_user_from_facebook ::", e)
            pass
        return new_user

@receiver(post_save, sender=UserBase)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class IngredientType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    def __unicode__(self):
        return self.name

class IngredientBrand(models.Model):
    name = models.CharField(max_length=200, unique=True)
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
    type = models.ForeignKey(IngredientType, on_delete=models.SET_NULL, blank=True,
                            null=True, related_name='ingredient_types')
    name = models.CharField(max_length=200)
    price = models.FloatField(blank=True, null= True, default=1)
    bottles = models.PositiveIntegerField(_('Bottles in Storage'), blank=True, null=True, default=0)
    quanlity_of_bottle = models.PositiveIntegerField(help_text=_('mL'), default=0)
    brand = models.ForeignKey(IngredientBrand, on_delete=models.SET_NULL, blank=True,
                        null=True, related_name='ingredient_brands')
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='ingredient', null=True, blank=True)

    def __unicode__(self):
        return self.name
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

class SeparateGlass(models.Model):
    CONST_UNIT_ML = 0
    CONST_UNIT_OZ = 10

    CONST_UNIT = (
        (CONST_UNIT_ML, _('mL')),
        (CONST_UNIT_OZ, _('oz')),
    )

    CONST_STATUS_ENABLED = 0
    CONST_STATUS_BLOCKED = 10

    CONST_STATUSES = (
        (CONST_STATUS_ENABLED, _('On')),
        (CONST_STATUS_BLOCKED, _('Off')),
    )

    status = models.PositiveSmallIntegerField(_('status'), choices=CONST_STATUSES,
                                              default=CONST_STATUS_ENABLED)
    name = models.CharField(max_length=200)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='glass')
    size = models.PositiveIntegerField()
    unit = models.SmallIntegerField(choices=CONST_UNIT, default=CONST_UNIT_ML)  

    @property
    def change_to_ml(self):
        if self.unit is self.CONST_UNIT_OZ:
            return float(self.size*29.57)
        return float(self.size)

    def __unicode__(self):
        return '-'.join([self.name, str(self.size)])

class Garnish(models.Model):
    name = models.CharField(max_length=200, unique=True)
    active = models.BooleanField(default=True)
    def __unicode__(self):
        return self.name

def get_admin():
    try:
        return UserBase.objects.filter(is_superuser=True).first().id
    except Exception as e:
        return 1

class Drink(models.Model):
    CONST_STATUS_ENABLED = 0
    CONST_STATUS_BLOCKED = 10

    CONST_STATUSES = (
        (CONST_STATUS_ENABLED, _('On')),
        (CONST_STATUS_BLOCKED, _('Off')),
    )

    CONST_PREP_SHAKE = 0
    CONST_PREP_FILTER = 10
    CONST_PREP_STIR = 20
    CONST_PREP_MUDDLE = 30

    CONST_PREP = (
        (CONST_PREP_SHAKE, _('shake')),
        (CONST_PREP_FILTER, _('filter')),
        (CONST_PREP_STIR, _('stir')),
        (CONST_PREP_MUDDLE, _('muddle')),
    )

    status = models.PositiveSmallIntegerField(_('status'), choices=CONST_STATUSES,
                                              default=CONST_STATUS_ENABLED)

    prep = models.PositiveSmallIntegerField(_('prep'), choices=CONST_PREP,
                                              default=CONST_PREP_SHAKE)

    name = models.CharField(max_length=200, unique=True)
    category = models.ManyToManyField(DrinkCategory)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'),
                        blank=True, null=True, upload_to='drink')
    image_background = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), 
                        upload_to='drink', blank=True, null=True)
    numbers_bought = models.PositiveIntegerField(blank=True, null= True, default=0)
    price = models.FloatField(blank=True, null=True)
    glass = models.ForeignKey(SeparateGlass,blank=True, null=True, related_name='drinks')
    key_word = models.CharField(max_length=200, blank=True, null=True)
    estimate_time = models.PositiveIntegerField(help_text=_('seconds'), default=0)
    is_have_ice = models.BooleanField(default=True)
    creator = models.ForeignKey(UserBase,related_name='creative_drinks', default=get_admin())
    creation_date = models.DateTimeField(auto_now_add=True)

    @property
    def total_part(self):
        temp = self.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PART).aggregate(sum_ratio=Sum('ratio'))
        if temp['sum_ratio'] == None:
            return 0
        return int(temp['sum_ratio'])

    @property
    def ml_per_part(self): 
        try:
            return round(float(self.glass.change_to_ml/self.total_part),2)
        except Exception as e:
            return 0

    def __unicode__(self):
        return self.name

class DrinkIngredient(models.Model):
    CONST_UNIT_PART = 0
    CONST_UNIT_ML = 10

    CONST_UNIT = (
        (CONST_UNIT_PART, _('Part')),
        (CONST_UNIT_ML, _('mL')),
    )

    drink = models.ForeignKey(Drink, related_name='ingredients', on_delete=models.SET_NULL, null=True, blank=True)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.SET_NULL, null=True, blank=True)
    ratio = models.FloatField(help_text=_('part'))
    unit = models.PositiveSmallIntegerField(choices=CONST_UNIT, default=CONST_UNIT_PART)


    # def __unicode__(self):
    #     return str(self.ingredient.id)

    # @staticmethod
    def change_to_ml(self, total_part=None, glass=None):
        if self.unit == DrinkIngredient.CONST_UNIT_ML:
            return self.ratio
        ret = float(self.ratio/total_part*glass)
        ret = fpformat.fix(ret, 2) 
        return float(ret)

class DrinkGarnish(models.Model):
    drink = models.ForeignKey(Drink, related_name='garnishes')
    garnish = models.ForeignKey(Garnish, related_name='drinks')
    ratio = models.FloatField(help_text=_('pcs'))

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
    STATUS_NOT_DO = 50
    STATUSES = (
        (STATUS_NEW, _("New")),
        (STATUS_PROCESSING, _("Processing")),
        (STATUS_FINISHED, _("Finished")),
        (STATUS_TOOK, _("Took")),
        (STATUS_NOT_TAKE, _("Not take")),
        (STATUS_NOT_DO, _("Not do due to ingredient")),
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
    tray_number = models.SmallIntegerField(null=True, blank=True)
    robot = models.ForeignKey(Robot, default=1, related_name='do_orders')
    photo = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='orders', null=True, blank=True)
    def __unicode__(self):
        return str(self.id)

    @property
    def qr_code(self):
        data = u'User:{} Id:{} Order_id:{}'.format(self.user.full_name, self.user.id, self.id)
        data = urllib.quote_plus(data)
        return u'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={}'.format(data)

@receiver(post_save, sender=Order)
def set_robot_and_line(sender, instance=None,created=False, **kwargs):
    '''
        Coodinarate robot and which line user will get their drinks
    '''
    if created:
        tray_number = 1
        try:
            order = Order.objects.all().order_by('-id')[1]
            if order.tray_number:
                tray_number = order.tray_number+1
        except Exception as e:
            pass
        if tray_number>4:
            tray_number=1
        instance.tray_number = tray_number
        instance.save()


class Tab(models.Model):

    CONST_NO_ICE = 0
    CONST_50_ICE = 10
    CONST_100_ICE = 20

    CONST_ICE_CHOICE = (
        (CONST_NO_ICE, _('No Ice')),
        (CONST_50_ICE, _('50% Ice')),
        (CONST_100_ICE, _('100% Ice')),
    )
    STATUS_NEW = 0
    STATUS_READY = 10
    STATUS_GLASS_READY = 20
    STATUS_ICE_READY = 30
    STATUS_INGREDIENT_1 = 31
    STATUS_INGREDIENT_2 = 32
    STATUS_INGREDIENT_3 = 33
    STATUS_INGREDIENT_4 = 34
    STATUS_INGREDIENT_5 = 35
    STATUS_INGREDIENT_6 = 36
    STATUS_INGREDIENT_7 = 37
    STATUS_INGREDIENT_8 = 38
    STATUS_INGREDIENT_READY = 40
    STATUS_GARNISH = 41
    STATUS_GARNISH = 42
    STATUS_GARNISH = 43
    STATUS_FINISHED = 50
    STATUSES = (
        (STATUS_NEW, _("New")),
        (STATUS_READY, _("Ready")),
        (STATUS_GLASS_READY, _("Glass ready")),
        (STATUS_ICE_READY, _("Ice ready")),
        (STATUS_INGREDIENT_1, _("Ingredient 1 finish")),
        (STATUS_INGREDIENT_2, _("Ingredient 2 finish")),
        (STATUS_INGREDIENT_3, _("Ingredient 3 finish")),
        (STATUS_INGREDIENT_4, _("Ingredient 4 finish")),
        (STATUS_INGREDIENT_5, _("Ingredient 5 finish")),
        (STATUS_INGREDIENT_6, _("Ingredient 6 finish")),
        (STATUS_INGREDIENT_7, _("Ingredient 7 finish")),
        (STATUS_INGREDIENT_8, _("Ingredient 8 finish")),
        (STATUS_INGREDIENT_READY, _("Ingredient finish")),
        (STATUS_GARNISH, _("Garnish 1 finish")),
        (STATUS_GARNISH, _("Garnish 1 finish")),
        (STATUS_GARNISH, _("Garnish 1 finish")),
        (STATUS_FINISHED, _("Finished")),
    )
    status = models.SmallIntegerField(choices=STATUSES, default=STATUS_NEW, null=True, blank=True)
    user = models.ForeignKey(UserBase, related_name='tab')
    drink = models.ForeignKey(Drink)
    ice = models.PositiveSmallIntegerField(_('ice'), choices=CONST_ICE_CHOICE, 
                                        default=CONST_100_ICE)
    garnishes = models.ManyToManyField(DrinkGarnish, blank =True)
    quantity = models.PositiveIntegerField(blank=True, null= True, default=0)
    quantity_done = models.PositiveIntegerField(blank=True, null= True, default=0)
    order = models.ForeignKey(Order, related_name='products',blank=True, null= True,)


class RobotIngredient(models.Model):

    robot = models.ForeignKey(Robot, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, related_name='robots')
    place_number = models.PositiveSmallIntegerField(null=True, blank=True, unique=True)
    remain_of_bottle = models.PositiveIntegerField(help_text=_('mL'), default=0)
    last_bottle = models.PositiveIntegerField(help_text=_('mL'), default=0)
    last_ingredient = models.ForeignKey(Ingredient, on_delete=models.SET_NULL, null=True, blank=True)


    def __unicode__(self):
        return str(self.ingredient.id)

class IngredientHistory(models.Model):
    CONST_STATUS_IMPORT= 0
    CONST_STATUS_EXPORT = 10

    CONST_STATUSES = (
        (CONST_STATUS_IMPORT, _('Import to storage')),
        (CONST_STATUS_EXPORT, _('Export to machine')),
    )

    creation_date = models.DateTimeField(auto_now_add=True)
    status = models.PositiveSmallIntegerField(_('status'), choices=CONST_STATUSES)
    machine = models.ForeignKey(Robot, related_name='ingredient_histories',null=True, blank=True)
    place_number = models.PositiveSmallIntegerField(null=True, blank=True)
    ingredient = models.ForeignKey(Ingredient, related_name='histories', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

@receiver(pre_save, sender=IngredientHistory)
def create_ingredient_history(sender, instance=None, **kwargs):
    if instance.status is IngredientHistory.CONST_STATUS_IMPORT:
        instance.ingredient.bottles += instance.quantity
    else:
        if instance.ingredient.bottles<instance.quantity:
            raise api_utils.BadRequest('OVER THE BOTTEL IN STORAGE')
        instance.ingredient.bottles -= instance.quantity

        if instance.place_number > 77 or instance.place_number<1 :
            raise api_utils.BadRequest('PLACE IS NOT TRUE, DOUBLE CHECK!')
        if not instance.machine.ingredients.filter(place_number=instance.place_number)\
            .update(last_ingredient=F('ingredient'), ingredient=instance.ingredient,\
                    last_bottle=F('remain_of_bottle'),\
                    remain_of_bottle=instance.ingredient.quanlity_of_bottle):
            temp = RobotIngredient(place_number=instance.place_number,\
                                robot=instance.machine, ingredient=instance.ingredient,\
                                remain_of_bottle=instance.ingredient.quanlity_of_bottle)
            temp.save()

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
        instance.machine.ingredients.filter(place_number=instance.place_number)\
                .update(remain_of_bottle=F('last_bottle'),ingredient=F('last_ingredient'))
    instance.ingredient.save()


