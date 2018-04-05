from django.db.utils import IntegrityError
from django.db.models import Q, Sum

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, exceptions, permissions, viewsets, mixins
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializer import *
from .models import *
from . import tasks
from . import payments
from django.conf import settings
from Manager.models import UserBase
from django.core.mail import send_mail, EmailMessage
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from datetime import datetime, timedelta
import hashlib
import fpformat
from pprint import pprint
'''
User API:
'''
# Create by user
class IsSuperAdmin(IsAdminUser):

    def has_permission(self, request, view):
        return request.user and request.user.is_staff and request.user.is_superuser

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

# Create by admin
class UserList(generics.ListCreateAPIView):
    queryset = UserBase.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer

    def get_queryset(self):
        ret = self.queryset
        search = self.request.GET.get('search', False)
        if search:
            ret = self.queryset.filter(Q(username__icontains=search)|\
                Q(email__icontains=search)|Q(id__icontains=search))
        return ret


# User login and get their profile
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

# Admin see detail user, user update, delete
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = UserBase
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        order = self.request.GET.get('order', False)
        if order:
            return UserWithOrderSerializer
        return self.serializer_class

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
                print (expired_time)
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
class UserFavoriteDrink(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        fav = self.request.user.favorite_drink.filter(id=pk).first()
        if fav:
            self.request.user.favorite_drink.remove(fav)
            return Response({'detail':'deleted'},status=status.HTTP_202_ACCEPTED)
        try:
            self.request.user.favorite_drink.add(Drink.objects.get(id=pk))
        except:
            raise api_utils.BadRequest("INVALID_DRINK")
        return Response({'detail':'added'},status=status.HTTP_202_ACCEPTED)


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
    serializer_class = OrderTabSerializer

    def get_queryset(self):
        return Tab.objects.filter(user=self.request.user)

class UpdateTab(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tab
    permission_classes = [IsAuthenticated]
    serializer_class = OrderTabSerializer

class UserOrder(generics.ListCreateAPIView):
    queryset = Order.objects.order_by('-creation_date')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        is_robot = self.request.GET.get('robot', False)
        if is_robot:
            return self.queryset.exclude(status=Order.STATUS_TOOK).order_by('creation_date')

        is_admin = self.request.GET.get('admin', False)
        if not is_admin:
            # user order history
            return self.queryset.filter(user=self.request.user)

        ret = self.queryset.all()        
        search = self.request.GET.get('search', False)
        if search:
            ret = ret.filter(Q(user__username__icontains=search)|\
                Q(user__email__icontains=search)|Q(id__icontains=search))
        
        return ret

    def create(self, request, *args, **kwargs):
        reorder_id = self.request.data.get('order_id', None)
        reorder = None
        # stripe_token = self.request.data.get('stripe_token', None)
        # if not stripe_token:
        #     raise api_utils.BadRequest("INVALID_STRIPE_TOKEN")

        tabs = request.user.tab.filter(order__isnull=True, quantity__gt=0)
        if reorder_id:
            try:
                reorder = Order.objects.get(id=reorder_id, user=request.user)
            except Exception as e:
                raise api_utils.BadRequest("INVALID_ORDER_ID")
            tabs = reorder.products.all()

        # Get data for new order
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user']=request.user

        # Check out tab for new order
        if not tabs:
            raise api_utils.BadRequest("YOU HAVE NOT ADDED TO TAB ANY THING")
        temp = tabs.aggregate(sum_quantity=Sum('quantity'))
        if temp['sum_quantity'] > 5:
            raise api_utils.BadRequest("OVER 5 QUANTITY, PLEASE REMOVE SOME!")
        total_bill = 0
        for tab in tabs:
            total_bill += int(tab.quantity)*float(tab.drink.price)

        # Payment with stripe
        # try:
        #     total_bill = float(total_bill)
        #     amount = int(round(total_bill*100))
        #     stripe_payment = payments.StripePayment()
        #     charge = stripe_payment.charge(amount=amount, currency=currency, token=stripe_token)
        #     serializer.validated_data['transaction_code'] = stripe_token
        #     serializer.validated_data['transaction_id'] = charge.id
        #     serializer.validated_data['amount'] = float(amount/100)
        #     serializer.validated_data['channel'] = Order.CHANNEL_STRIPE
        # except payments.StripePayment.StripePaymentException:
        #     raise api_utils.BadRequest('STRIPE_ERROR')
        # except Exception as e:
        #     raise api_utils.BadRequest(e.message)

        # Create new order
        serializer.validated_data['amount'] = float(total_bill)
        order = serializer.create(serializer.validated_data)
        if reorder:
            for tab in tabs:
                garnishes = tab.garnishes.all()
                new_tab = tab
                new_tab.pk = None
                new_tab.order=order
                new_tab.status=Tab.STATUS_NEW
                new_tab.quantity_done=0
                new_tab.save()
                for garnish in garnishes:
                    new_tab.garnish.add(garnish)
        else:
            tabs.update(order=order)
        # pprint(vars(serializer.data))
        headers = self.get_success_headers(serializer.data)
        return Response(OrderSmallSerializer(order).data, status=status.HTTP_201_CREATED, headers=headers)


class UserOrderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

'''
Drink API:
'''

class DrinkCategoryList(generics.ListCreateAPIView):
    queryset = DrinkCategory.objects.all()
    serializer_class = DrinkCategorySerializer
    permission_classes = [IsAuthenticated]
    paginator = None

    def get_queryset(self):
        is_main = self.request.GET.get('main', False)
        if is_main:
            return self.queryset.filter(parent__name="Type")
        return self.queryset

class DrinkCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DrinkCategory
    serializer_class = DrinkCategorySerializer
    permission_classes = [IsAuthenticated]

class DrinkList(generics.ListCreateAPIView):
    queryset = Drink.objects.all().order_by('-numbers_bought')
    serializer_class = DrinkSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DrinkSerializer
        return DrinkCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['creator']=request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def get_queryset(self):
        is_admin = self.request.GET.get('admin', False)
        ret = self.queryset.exclude(Q(ingredients__ingredient__status=Ingredient.CONST_STATUS_BLOCKED)|\
                    Q(glass__status=SeparateGlass.CONST_STATUS_BLOCKED)|\
                    Q(status=Drink.CONST_STATUS_BLOCKED))
        if is_admin:
            print (is_admin)
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
    serializer_class = DrinkUpdateSerializer
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
    queryset = Ingredient.objects.all().order_by('name')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # print pprint(vars(self.request.method))
        # print self.request.method
        if self.request.method == 'GET':
            return IngredientListSerializer
        return IngredientCreateSerializer

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
    serializer_class = IngredientListSerializer
    permission_classes = [IsAuthenticated]

class IngredientTypeList(generics.ListCreateAPIView):
    queryset = IngredientType.objects.all().order_by('name')
    serializer_class = IngredientTypeSerializer
    permission_classes = [IsAuthenticated]
    paginator = None

class IngredientTypeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = IngredientType
    serializer_class = IngredientBrandSerializer
    permission_classes = [IsAuthenticated]

class IngredientBrandTypeList(generics.ListAPIView):
    queryset = IngredientBrand.objects.all().order_by('name')
    serializer_class = IngredientTypeSerializer
    permission_classes = [IsAuthenticated]
    paginator = None

    def get_queryset(self):
        try:
            type = self.request.GET.get('type', None)
            ret = self.queryset.filter(ingredient_brands__type=type).distinct()
        except Exception as e:
            raise api_utils.BadRequest("INVALID_TYPE")
        return ret

class IngredientBrandList(generics.ListCreateAPIView):
    queryset = IngredientBrand.objects.all().order_by('name')
    serializer_class = IngredientTypeSerializer
    permission_classes = [IsAuthenticated]
    
class IngredientBrandDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = IngredientBrand
    serializer_class = IngredientBrandSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientList(generics.ListCreateAPIView):
    queryset = DrinkIngredient.objects.all().order_by('name')
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DrinkIngredient
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]



#Robot
# class RobotList(generics.ListAPIView):
class RobotList(generics.ListCreateAPIView):
    #Support 1 for now, cannot create new robot
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer
    permission_classes = [IsAuthenticated]


class RobotDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Robot
    serializer_class = RobotSerializer
    permission_classes = [IsAuthenticated]
    '''
        update robot and ingredient robot contain
    '''


class IngredientHistoryList(generics.ListCreateAPIView):
    queryset = IngredientHistory.objects.all().order_by('-creation_date')
    serializer_class = IngredientHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ret = self.queryset
        robot = self.request.GET.get('robot',None)
        if robot:
            ret = ret.filter(machine=robot)
        return ret


class IngredientHistoryDetail(generics.RetrieveDestroyAPIView):
    # Change permission is not allowed.
    queryset = IngredientHistory
    serializer_class = IngredientHistorySerializer
    permission_classes = [IsSuperAdmin]

class RobotChange(APIView):
    permission_classes = [IsAuthenticated]
    '''
        update robot status
    '''
    def post(self, request, format=None):
        ret = {}
        tab = None
        robot = self.request.data.get('robot',0)
        try:
            robot = Robot.objects.get(id=robot)
        except Exception as e:
            raise api_utils.BadRequest("INVALID_MACHINE")

        order = self.request.data.get('order',0)
        try:
            order = Order.objects.get(id=order)
        except Exception as e:
            raise api_utils.BadRequest("INVALID_ORDER")
        order.status = Order.STATUS_PROCESSING
        # try:
        status_drink = self.request.data.get('status_drink',None)
        if status_drink:
            # drink = tab
            status_drink=int(status_drink)
            tab = self.request.data.get('drink',0)
            try:
                tab = order.products.get(drink=tab)
            except Exception as e:
                raise api_utils.BadRequest("INVALID_DRINK")
            # Change ingredient status
            if status_drink>30 and status_drink<40:
                ingredient = self.request.data.get('ingredient',None)
                try:
                    drink_ingredient = tab.drink.ingredients.get(id=ingredient)
                    # drink_ingredient = drink_ingredient.ingredient
                except Exception as e:
                    raise api_utils.BadRequest("INVALID_INGREDIENT")
                ratio_require = drink_ingredient.change_to_ml(tab.drink.total_part, tab.drink.glass.change_to_ml)

                try:
                    robot_ingredient = robot.ingredients.get(ingredient=drink_ingredient.ingredient)
                except Exception as e:
                    subject = "Hi-Effeciency - Robot {} don't have {}".format(robot.id, drink_ingredient.ingredient.name)
                    html_content = render_to_string('email/robot_error_1.html',{'ingredient':drink_ingredient.ingredient,'robot':robot.id})
                    tasks.send_email(subject, html_content, UserBase.objects.filter(is_superuser=True).values_list('email',flat=True))
                    raise api_utils.BadRequest("THIS_ROBOT_DONT_HAVE_THIS_INGREDIENT")

                if robot_ingredient.remain_of_bottle < ratio_require:
                    subject = 'Hi-Effeciency - Robot {} out of {}'.format(robot.id, robot_ingredient.ingredient.name)
                    html_content = render_to_string('email/robot_error_2.html',{'ingredient':robot_ingredient})
                    tasks.send_email(subject, html_content, UserBase.objects.filter(is_superuser=True).values_list('email',flat=True))
                    raise api_utils.BadRequest("NOT ENOUGH INGREDIENT ON THIS ROBOT")
                    
                if robot_ingredient.remain_of_bottle < 100:
                    # warning
                    subject = 'Hi-Effeciency - Robot {} almost out of {}'.format(robot.id, robot_ingredient.ingredient.name)
                    html_content = render_to_string('email/robot_warning.html',{'ingredient':robot_ingredient})
                    tasks.send_email(subject, html_content, UserBase.objects.filter(is_superuser=True).values_list('email',flat=True))

                robot_ingredient.remain_of_bottle -= ratio_require
                robot_ingredient.save()
                ret['place_number'] = robot_ingredient.place_number
            if status_drink == Tab.STATUS_FINISHED:
                drink.quantity_done +=1
                if drink.quantity_done < drink.quantity:
                    status_drink = Tab.STATUS_NEW
            tab.status=status_drink
            tab.save()
        if order.products.all().count() == \
            order.products.filter(status=Tab.STATUS_FINISHED).count():
            order.status = Order.STATUS_FINISHED
        # except Exception as e:
        #     raise e
        order.save()
        if tab:
            ret['drink'] = OrderTabSerializer(instance=tab).data
        ret['order_status'] = order.status
        return Response(ret, status=status.HTTP_200_OK)
