# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from .models import *
from .api import SendVerificationEmail
import hashlib

class VerificationEmail(TemplateView):
    template_name = "inform.html"

    def get_verification_code(self, user):
        code = '{}++{}++{}'.format(settings.SECRET_KEY, user.id, user.email)
        return '{}_{}'.format(hashlib.sha1(code).hexdigest(),user.id)


    def get_context_data(self, **kwargs):
        ret = super(VerificationEmail, self).get_context_data(**kwargs)
        verification_code = self.request.GET.get('code',None)
        if verification_code:
            code, user_id = verification_code.split('_')
            user = UserBase.objects.filter(pk=user_id).first()

            if not user:
                raise api_utils.BadRequest('INVALID_USER')

            if verification_code == self.get_verification_code(user):
                user.is_email_verified = True
                user.save()
                ret['message'] = 'Email verification is successful.'
            else:
                ret['message'] ='INVALID EMAIL VERIFICATION CODE.'
        else:
            ret['message'] ='INVALID EMAIL VERIFICATION CODE.'
        return ret