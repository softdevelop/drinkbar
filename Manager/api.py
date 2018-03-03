from django.db.utils import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, exceptions, permissions, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from serializer import *
from models import *

class UserSignUp(generics.CreateAPIView):
    serializer_class = UserSignupSerializer

    def post(self, request, format=None):
        fb_token = request.data.get('fb_token')
        gp_token = request.data.get('gp_token')
        user = None

        try:
            if fb_token or gp_token:
                default_username = request.data.get('username')
                # TODO can be dangerous here?!? (send a FB token w/o email and force use any other email)
                default_email = request.data.get('email')

                if fb_token:
                    user = OneDollarUser.objects.get_or_create_user_from_facebook(fb_token, default_username, default_email)
                else:
                    user = OneDollarUser.objects.get_or_create_user_from_googleplus(gp_token)

                if not user:
                    raise api_utils.BadRequest('UNABLE_TO_LOGIN')
                else:
                    user.country_id = request.data.get('country')
                    user.deviceID = request.data.get('deviceID', None)
                    user.platform = request.data.get('platform', None)
                    if not user.referrer:
                        referrer = OneDollarUser.objects.filter(referral_code=request.data.get('referrer', None)).first()

                        if referrer:
                            user.referrer = referrer

                    user.save()
            else:
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.create(serializer.validated_data)

            serializer = UserWithTokenSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            raise ValidationError({'username': str(e[1])})
