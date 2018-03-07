from django.conf.urls import include, url
import models
import api as api_views
from Manager import views

urlpatterns = [
    url(r'^user/signup/$', api_views.UserSignUp.as_view(), name='user-signup'), 
    url(r'^user/me/$', api_views.UserProfile.as_view(), name='user-me'), 
    url(r'^user/(?P<pk>[0-9]+)/$', api_views.UserDetail.as_view(), name='user-detail'), 
    url(r'^user/change/password/$', api_views.UserChangePassword.as_view(), name='user-change-password'), 
    url(r'^user/comfirm-email/$', api_views.UserConfirmEmail.as_view(),name='comfirm_email'),
    # url(r'^user/comfirm-email/$', views.comfirm_email,name='comfirm_email'),
    url(r'^user/forgot-password/$', api_views.UserForgotPassword.as_view(), name='forgot_password'),
    # url(r'^user/forgot-password/$', views.forgot_password,name='forgot_password'),
]