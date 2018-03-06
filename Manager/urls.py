from django.conf.urls import include, url
import models
import api as api_views

urlpatterns = [
    url(r'^user/signup/$', api_views.UserSignUp.as_view(), name='user-signup'), 
    url(r'^user/me/$', api_views.UserProfile.as_view(), name='user-me'), 
    url(r'^user/(?P<pk>[0-9]+)/$', api_views.UserDetail.as_view(), name='user-detail'), 
    url(r'^user/change/password/$', api_views.UserChangePassword.as_view(), name='user-change-password'), 
]