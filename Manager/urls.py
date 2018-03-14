from django.conf.urls import include, url
import models
import api as api_views
from Manager import views

urlpatterns = [
    url(r'^user/$', api_views.UserList.as_view(), name='user-list'), 
    url(r'^user/signup/$', api_views.UserSignUp.as_view(), name='user-signup'), 
    url(r'^user/me/$', api_views.UserProfile.as_view(), name='user-me'), 
    url(r'^user/(?P<pk>[0-9]+)/$', api_views.UserDetail.as_view(), name='user-detail'), 
    url(r'^user/change/password/$', api_views.UserChangePassword.as_view(), name='user-change-password'), 
    url(r'^user/forget/password/$', api_views.UserForgetPassword.as_view(), name='user-forget-password'), 
    url(r'^drink/category/$',api_views.DrinkCategoryList.as_view(), name='drink-categories'),
    url(r'^drink/category/(?P<pk>[0-9]+)/$',api_views.DrinkCategoryDetail.as_view(), name='drink-categories-detail'),
    url(r'^drink/$',api_views.DrinkList.as_view(), name='drink-list'),
    url(r'^drink/(?P<pk>[0-9]+)/$',api_views.DrinkDetial.as_view(), name='drink-detail'),
    url(r'^glass/$',api_views.SeparateGlassList.as_view(), name='glass-list'),
    url(r'^glass/(?P<pk>[0-9]+)/$',api_views.SeparateGlassDetail.as_view(), name='glass-detail'),
    url(r'^garnish/$',api_views.GarnishList.as_view(), name='garnish-list'),
    url(r'^garnish/(?P<pk>[0-9]+)/$',api_views.GarnishDetail.as_view(), name='garnish-detail'),
    url(r'^ingredient/$', api_views.IngredientList.as_view(), name="ingredient-list"),
    url(r'^ingredient/(?P<pk>[0-9]+)/$', api_views.IngredientDetail.as_view(), name="ingredient-detail"),
    url(r'^drink/ingredient/$', api_views.DrinkIngredientList.as_view(), name="drink-ingredient-list"),
    url(r'^drink/ingredient/(?P<pk>[0-9]+)/$', api_views.DrinkIngredientDetail.as_view(), name="drink-ingredient-detail"),
]