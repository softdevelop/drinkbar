# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User, Group
from django.views.decorators.csrf import csrf_exempt
import jwt, json
from django.conf import settings
from Manager.models import UserBase
from django.core.mail import send_mail, EmailMessage
import random

@csrf_exempt
def comfirm_email(request):
	email = request.POST.get('email')
	check_email = UserBase.objects.get(email=email)
	opt = random.randint(100000, 9999999)
	try:
		content = 'Code reset password: '+ str(opt)
		from_email = settings.DEFAULT_FROM_EMAIL
		send_mail('Reset password:', content, from_email, [email])

		check_email.opt = opt
		check_email.save()

		response = {
			'result': 1,
			'data':{
				'token' : check_email.token
			}
		}
	except:
		print('error')
		response = {
			'result': 0,
			'data':{
			
			}
		}
	return JsonResponse(response)


@csrf_exempt
def forgot_password(request):
	# token = request.POST.get('token')
	# opt = request.POST.get('opt')
	print request.user.username
	# try:
	print '==============='
	# print token
	# obj_user = UserBase.objects.filter(token=token)
	# print '1111111111'
	# print obj_user
	# if(obj_user.opt == opt):
	# 	print '==> YES'
	# else:
	# 	print '===> NO'

	response = {
		'result': 1,
		'data':{
		
		}
	}
	# except:
	# 	response = {
	# 		'result': 0,
	# 		'data':{
			
	# 		}
	# 	}

	return JsonResponse(response)
