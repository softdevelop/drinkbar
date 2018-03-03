# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import force_text
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from categories.base import CategoryBase
from django.urls import reverse

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

    birthday = models.DateField(null=True, blank=True)
    avatar = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='avatars')
                           
    @property
    def full_name(self):
        return u'{} {}'.format(self.first_name,self.last_name)

    @property
    def token(self):
        return self.auth_token.key

@receiver(post_save, sender=UserBase)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        instance.username=instance.email
        instance.save()
        Token.objects.create(user=instance)
    
class SeparateGlass(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='glass')
    size = models.PositiveIntegerField()    

    def __unicode__(self):
        return self.name
class Ingredient(models.Model):
    CONST_STATUS_ENABLED = 0
    CONST_STATUS_BLOCKED = 10

    CONST_STATUSES = (
        (CONST_STATUS_ENABLED, _('Enabled')),
        (CONST_STATUS_BLOCKED, _('Blocked')),
    )

    status = models.PositiveSmallIntegerField(_('status'), choices=CONST_STATUSES,
                                              default=CONST_STATUS_ENABLED)

    name = models.CharField(max_length=200)
    price = models.FloatField(blank=True, null= True)
    bottles = models.PositiveIntegerField(blank=True, null=True)

    def __unicode__(self):
        return self.name


class Drink(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(DrinkCategory, blank=True, null=True)
    image = models.ImageField(help_text=_('Picture shall be squared, max 640*640, 500k'), upload_to='drink')
    ingredients = models.ManyToManyField(Ingredient)
    numbers_bought = models.PositiveIntegerField(blank=True, null= True, default=0)
    price = models.FloatField(blank=True, null=True)

    def __unicode__(self):
        return self.name


class Garnish(models.Model):
    name = models.CharField(max_length=200)
    active = models.BooleanField(default=True)
    drink = models.ForeignKey(Drink, related_name='garnishes')
    def __unicode__(self):
        return self.name

class Order(models.Model):
    user = models.ForeignKey(UserBase, related_name='orders')
    amount = models.FloatField(blank=True, null=True)

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
    ice = models.PositiveSmallIntegerField(_('status'), choices=CONST_ICE_CHOICE, 
                                        default=CONST_100_ICE)
    quantity = models.PositiveIntegerField(blank=True, null= True, default=0)
    order = models.ForeignKey(Order, related_name='products')