from django.conf.urls import include, url
import models
import api as api_views

urlpatterns = [
    url(r'^user/signup/$', api_views.UserSignUp.as_view(), name='user-signup'), 
    url(r'^user/me/$', api_views.UserProfile.as_view(), name='user-me'), 
]