from django.db.utils import IntegrityError
from django.db.models import Q

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, exceptions, permissions, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from serializer import *
from models import *
import tasks
from django.conf import settings
from Manager.models import UserBase
from django.core.mail import send_mail, EmailMessage
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from datetime import datetime, timedelta
import hashlib

'''
User API:
'''

class UserSignUp(generics.CreateAPIView):
    serializer_class = UserSignupSerializer

    def post(self, request, format=None):
        fb_token = request.data.get('fb_token')
        gp_token = request.data.get('gp_token')
        user = None

        try:
            if fb_token or gp_token:
                # TODO can be dangerous here?!? (send a FB token w/o email and force use any other email)
                if fb_token:
                    user = UserBase.get_or_create_user_from_facebook(fb_token)
                if not user:
                    raise api_utils.BadRequest('UNABLE_TO_LOGIN')
            else:
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.create(serializer.validated_data)

            serializer = UserWithTokenSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            raise ValidationError({'email': str(e[1])})

class UserList(generics.ListCreateAPIView):
    queryset = UserBase.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

class UserProfile(generics.GenericAPIView):
    serializer_class = UserWithTokenSerializer

    def post(self, request, format=None):
        fb_token = request.data.get('fb_token')
        # gp_token = request.data.get('gp_token')
        email = request.data.get('email')
        password = request.data.get('password')

        user = None

        if request.user.is_authenticated():
            user = request.user
        elif fb_token:
            user = UserBase.get_or_create_user_from_facebook(fb_token, should_create=False)
        # elif gp_token:
        #     user = UserBase.get_or_create_user_from_googleplus(gp_token, should_create=False)
        elif email and password:
            user = authenticate(username=email, password=password)
        if not user:
            return Response({'user': 'INVALID_PROFILE'}, status=status.HTTP_400_BAD_REQUEST)

        # if request.session.get('_auth_user_id', 0) != user.id:
        #     # create logged in session for the user if not available
        #     utils.login_user(request, user)
        if type(user) == UserBase:
            user.last_login = datetime.now()
            user.save()
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        return Response({'user': 'INVALID_PROFILE'}, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = UserBase
    permission_classes = [IsAuthenticated]

class UserChangePassword(APIView):

    def post(self,request,format=None):
        old_password = request.data.get('old_password', None)
        if not old_password:
            raise api_utils.BadRequest("INVALID_CURRENT_PASSWORD")
        else:
            if authenticate(username=request.user.username, password=old_password):
                try:   
                    new_password = request.data.get('new_password', None)     
                    if not new_password:
                        raise api_utils.BadRequest("INVALID_NEW_PASSWORD")
                    request.user.set_password(new_password) 
                    request.user.save()
                except Exception as e:
                    raise api_utils.BadRequest(e)
            else:
                raise api_utils.BadRequest("INVALID_CURRENT_PASSWORD")
        return Response(status=status.HTTP_202_ACCEPTED)


class UserForgetPassword(APIView):
    datetime_format = '%Y%m%d%H%M%S'

    def get_reset_code(self, email, expired_time=None):
        if not expired_time:
            expired_time = (datetime.now() + timedelta(minutes=5)).strftime(self.datetime_format)
        code = ''.join([email, settings.SECRET_KEY, expired_time])
        return ''.join([hashlib.sha1(code).hexdigest().upper()[-8:], expired_time])

    def post(self, request, format=None):
        reset_code = request.data.get('code', None)
        email = self.request.data.get('email')
        user = UserBase.objects.filter(email=email).first()
        if not reset_code:
            if user:
                user.opt = self.get_reset_code(email)
                user.save()
                reset_code = user.opt[:8]
                subject = 'Hi-Effeciency - Reset password requested'
                html_content = render_to_string('email/password_reset.html', {'user':user.full_name, 'reset_code':reset_code})
                tasks.send_email(subject, html_content, [email])
            else:
                raise api_utils.BadRequest('EMAIL_NOT_EXISTS')

            return Response({'message': 'A code for verify was sent to your email. '
                            , 'success': True}, status=status.HTTP_200_OK)
        else:
            password = self.request.data.get('password')
            if not password:
                raise api_utils.BadRequest('NEW_PASSWORD_MISSING')
            if not user:
                raise api_utils.BadRequest('INVALID_USER')
            try:
                code = user.opt[:8]
                expired_time = user.opt[8:]
                print expired_time
                if reset_code != code:
                    raise api_utils.BadRequest('INVALID_RESET_CODE')
            except:
                raise api_utils.BadRequest('INVALID_RESET_CODE')

            if datetime.now().strftime(self.datetime_format) > expired_time:
                raise api_utils.BadRequest('RESET_CODE_EXPIRED')

            user.set_password(password)
            user.save()

            return Response({'message': 'Password reset is successful.', 'success': True})

        return Response({
            'error': 'Error! Can\'t start forget password process',
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)

class SendVerificationEmail(APIView):

    def get_verification_code(self, user):
        code = '{}++{}++{}'.format(settings.SECRET_KEY, user.id, user.email)
        return '{}_{}'.format(hashlib.sha1(code).hexdigest(),user.id)

    def post(self, request, format=None):
        email = self.request.data.get('email')
        user = UserBase.objects.filter(email=email).first()
        if not user:
            return Response({
                'error': 'Error! Can\'t start email verification process',
            }, status=status.HTTP_400_BAD_REQUEST)

        verification_link = settings.SITE_URL +reverse('user-verify-email')+'?code={}'.format(self.get_verification_code(user))

        subject = 'Hi-Efficiency - Validate your account first'
        html_content = render_to_string('email/verify_email.html', {'verification_link':verification_link})
        tasks.send_email(subject, html_content, [user.email])

        return Response({'message': 'An email was sent to your email. '
                                    'Please click on the link in it to verify your email address.'},status=status.HTTP_202_ACCEPTED)
class AddToTab(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddToTabSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user']=request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class MyTab(generics.ListAPIView):
    queryset = Tab
    permission_classes = [IsAuthenticated]
    serializer_class = AddToTabSerializer

    def get_queryset(self):
        return Tab.objects.filter(user=self.request.user)

'''
Drink API:
'''

class DrinkCategoryList(generics.ListCreateAPIView):
    queryset = DrinkCategory.objects.all()
    serializer_class = DrinkCategorySerializer
    permission_classes = [IsAuthenticated]
    paginator = None

class DrinkCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DrinkCategory
    serializer_class = DrinkCategorySerializer
    permission_classes = [IsAuthenticated]


class DrinkList(generics.ListCreateAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        is_admin = self.request.GET.get('admin', False)
        ret = self.queryset.exclude(Q(ingredients__ingredient__status=Ingredient.CONST_STATUS_BLOCKED)|\
                    Q(glass__status=SeparateGlass.CONST_STATUS_BLOCKED))
        if is_admin:
            print is_admin
            ret = self.queryset.all()

        search_query = self.request.GET.get('search', None)
        if search_query:
            ret = ret.filter(name__icontains=search_query)
            
        type = self.request.GET.get('type', None)
        if type:
            ret = ret.filter(type=type)

        category = self.request.GET.get('category', None)
        if category:
            ret = ret.filter(category=category)

        return ret

class DrinkDetial(generics.RetrieveUpdateDestroyAPIView):
    queryset = Drink
    serializer_class = DrinkSerializer
    permission_classes = [IsAuthenticated]

class SeparateGlassList(generics.ListCreateAPIView):
    queryset = SeparateGlass.objects.all()
    serializer_class = SeparateGlassSerializer
    permission_classes = [IsAuthenticated]
    paginator = None

    def get_queryset(self):
        is_admin = self.request.GET.get('admin', False)
        ret = self.queryset.exclude(status=SeparateGlass.CONST_STATUS_BLOCKED)
        if is_admin:
            ret = self.queryset.all()
        return ret

class SeparateGlassDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SeparateGlass
    serializer_class = SeparateGlassSerializer
    permission_classes = [IsAuthenticated]
    
class GarnishList(generics.ListCreateAPIView):
    queryset = Garnish.objects.all()
    serializer_class = GarnishSerializer
    permission_classes = [IsAuthenticated]
    paginator = None

class GarnishDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Garnish
    serializer_class = GarnishSerializer
    permission_classes = [IsAuthenticated]

'''
Ingredient API
'''

class IngredientList(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        is_admin = self.request.GET.get('admin', False)
        ret = self.queryset.exclude(status=Ingredient.CONST_STATUS_BLOCKED)

        type = self.request.GET.get('type', None)
        if type:
            ret = ret.filter(type=type)

        brand = self.request.GET.get('brand', None)
        if brand:
            ret = ret.filter(brand=brand)

        if is_admin:
            ret = self.queryset.all()
        return ret

class IngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

class IngredientTypeList(generics.ListCreateAPIView):
    queryset = IngredientType.objects.all()
    serializer_class = IngredientTypeSerializer
    permission_classes = [IsAuthenticated]
    paginator = None

class IngredientTypeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = IngredientType
    serializer_class = IngredientBrandSerializer
    permission_classes = [IsAuthenticated]

class IngredientBrandList(generics.ListCreateAPIView):
    queryset = IngredientBrand.objects.all().order_by('id')
    serializer_class = IngredientTypeSerializer
    permission_classes = [IsAuthenticated]
    paginator = None

    def get_queryset(self):
        ret = self.queryset.all()
        type = self.request.GET.get('type', None)
        if type:
            ret = ret.filter(ingredient_brands__type=type)
        return ret
    
class IngredientBrandDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = IngredientBrand
    serializer_class = IngredientBrandSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientList(generics.ListCreateAPIView):
    queryset = DrinkIngredient.objects.all()
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DrinkIngredient
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]