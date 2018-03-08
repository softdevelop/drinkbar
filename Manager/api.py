from django.db.utils import IntegrityError
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, exceptions, permissions, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from serializer import *
from models import *
from django.conf import settings
from Manager.models import UserBase
from django.core.mail import send_mail, EmailMessage
from django.http import HttpResponse, JsonResponse

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
        ret = self.queryset.all()
        search_query = self.request.GET.get('search', None)
        if search_query:
            ret = ret.filter(name__icontains=search_query)

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

class IngredientList(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

class IngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientList(generics.ListCreateAPIView):
    queryset = DrinkIngredient.objects.all()
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DrinkIngredient
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]