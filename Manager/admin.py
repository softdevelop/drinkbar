# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib import auth
from django.contrib.auth.admin import UserAdmin
from .models import *
from django.utils.translation import ugettext_lazy as _
from categories.models import Category as DefaultCategory

from import_export import resources, fields
from import_export.admin import ImportExportModelAdmin
from import_export.widgets import ForeignKeyWidget

# # Register your models here.
admin.site.unregister(auth.models.Group)
admin.site.unregister(DefaultCategory)

class UserBaseAdmin(UserAdmin):
    list_display = ('id','email','first_name','last_name','birthday')

    fieldsets = (
        (None, {'fields': ('username','email', 'password')}),
        (_('Personal info'),
            {'fields': ('first_name', 'last_name', 'birthday','avatar',
            'avatar_url','is_email_verified','fb_uid','opt')}),
        (_('Permissions'), 
            {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), 
            {'fields': ('last_login', 'date_joined')}),
        )

    readonly_fields = ('fb_uid',)


'''
Ingredient
'''
class IngredientBrandAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    pass
class IngredientTypeAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    pass

class IngredientAdminResource(resources.ModelResource):
    brand = fields.Field(
        column_name='brand',
        attribute='brand',
        widget=ForeignKeyWidget(IngredientBrand, 'name'))

    type = fields.Field(
        column_name='type',
        attribute='type',
        widget=ForeignKeyWidget(IngredientType, 'name'))

    class Meta:
        model = Ingredient

class IngredientHistoryInline(admin.TabularInline):
    model = IngredientHistory
    extra = 1

class IngredientHistoryAdmin(admin.ModelAdmin):
    list_display = ('creation_date', 'status', 'machine','ingredient','quantity')

    
class IngredientAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    resource_class = IngredientAdminResource
    list_display = ('type', 'brand', 'name', 'status', 'price', 
        'bottles','quanlity_of_bottle')

    search_fields = ('name',)
    list_editable = ('status',)
    inlines = (IngredientHistoryInline,)


'''
Drink 
'''
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
   
class SeparateGlassAdmin(admin.ModelAdmin):
    list_display = ('name','status','image','size','unit','_ml')

    list_editable = ('status',)
    def _ml(self, obj):
        return obj.change_to_ml

class GarnishAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id','name','active')
    list_editable = ('active',)

class DrinkTypeAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id','name','image')

class DrinkIngredientInline(admin.TabularInline):
    model = DrinkIngredient
    extra = 1

class DrinkGarnishInline(admin.TabularInline):
    model = DrinkGarnish
    extra = 1

class DrinkAdminResource(resources.ModelResource):
    glass = fields.Field(
        column_name='glass',
        attribute='glass',
        widget=ForeignKeyWidget(SeparateGlass, 'name'))

    type = fields.Field(
        column_name='type',
        attribute='type',
        widget=ForeignKeyWidget(DrinkType, 'name'))

    class Meta:
        model = Drink
        fields = ('id','name','image','type',
            'numbers_bought','price','glass','key_word',
            'estimate_time','is_have_ice','ingredients__ingredient',)


class DrinkAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = DrinkAdminResource
    list_display = ('name','type','category','glass','numbers_bought','price')
    readonly_fields = ('numbers_bought',)

    list_filter = ('type','category')
    inlines = (DrinkIngredientInline,DrinkGarnishInline)

class DrinkIngredientAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('drink','ingredient','ratio','unit')


'''
Order
'''
class TabInline(admin.TabularInline):
    model = Tab
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','amount')
    readonly_fields = ('amount',)
    inlines = (TabInline,)


'''
Robot
'''
class RobotIngredientInline(admin.TabularInline):
    model = RobotIngredient
    extra = 1
    max_num = 60
    readonly_fields = ('remain_of_bottle',)

class RobotAdmin(admin.ModelAdmin):
    list_display = ('id', 'status')
    list_editable = ('status',)
    inlines = (RobotIngredientInline,)

admin.site.register(UserBase, UserBaseAdmin)
admin.site.register(DrinkType, DrinkTypeAdmin)
admin.site.register(DrinkCategory, DrinkCategoryAdmin)
admin.site.register(Drink,DrinkAdmin)
admin.site.register(DrinkIngredient, DrinkIngredientAdmin)
admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(IngredientHistory, IngredientHistoryAdmin)
admin.site.register(IngredientBrand, IngredientBrandAdmin)
admin.site.register(IngredientType, IngredientTypeAdmin)
admin.site.register(Garnish, GarnishAdmin)
admin.site.register(Robot, RobotAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(SeparateGlass, SeparateGlassAdmin)
