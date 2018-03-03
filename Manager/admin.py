# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib import auth
from django.contrib.auth.admin import UserAdmin
from .models import *
from django.utils.translation import ugettext_lazy as _
from categories.models import Category as DefaultCategory

# # Register your models here.
admin.site.unregister(auth.models.Group)
admin.site.unregister(DefaultCategory)

class UserBaseAdmin(UserAdmin):
    list_display = ('email','birthday','avatar')

    fieldsets = (
        (None, {'fields': ('username','email', 'password')}),
            (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Personal info'),
         {'fields': ('first_name', 'last_name','birthday','avatar')}),
    )
class DrinkCategoryAdmin(admin.ModelAdmin):
    list_display = ('id','name','_link','active')
    fieldsets = (
        (None, {
            'fields': ('parent', 'name','active','image',)
        }),
    )

    def _link(self, obj):
        link = str(obj.get_absolute_url()).title()[1:]
        return link.replace("/", ", ")
    _link.short_description = 'Full Category'
class GarnishInline(admin.TabularInline):
    model = Garnish
    extra = 0
    min_num = 1

class DrinkAdmin(admin.ModelAdmin):
    list_display = ('name','category','numbers_bought','price')
    filter_horizontal = ('ingredients',)
    readonly_fields = ('numbers_bought',)

    inlines = (GarnishInline,)

class TabAdmin(admin.ModelAdmin):
    list_display = ('user','drink','ice','quantity')

admin.site.register(UserBase, UserBaseAdmin)
admin.site.register(DrinkCategory, DrinkCategoryAdmin)
admin.site.register(Drink,DrinkAdmin)
admin.site.register(Ingredient)
admin.site.register(Tab, TabAdmin)
