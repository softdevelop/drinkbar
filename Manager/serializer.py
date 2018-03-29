
from rest_framework import fields, serializers
from models import *
from pprint import pprint
import ast
import api_utils


class UserSignupSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, style={'input_type': 'password'})
	class Meta:
		model = UserBase
		fields = ('first_name','last_name','email', 'password',
				'birthday','avatar',)

	def create(self, validated_data):
		if validated_data.has_key('password'):
			user = UserBase()
			user.set_password(validated_data['password'])
			validated_data['password'] = user.password
		if validated_data['email']:
			validated_data['username'] = validated_data['email']
		return super(UserSignupSerializer, self).create(validated_data)

class UserSerializer(serializers.ModelSerializer):
	avatar_url = serializers.CharField(read_only=True)
	qr_code = serializers.SerializerMethodField(read_only=True)

	class Meta:
		model = UserBase
		fields = ('id','username','password','email','avatar','birthday','avatar_url', 'first_name','last_name', 'fb_uid', 'opt', 
			'is_email_verified', 'avatar_url', 'is_active', 'is_staff', 
			'is_superuser', 'last_login', 'date_joined','qr_code')
		extra_kwargs = {'password': {'write_only': True},
						'username': {'write_only': True},}

	def get_qr_code(self,obj):
		return obj.qr_code

	def create(self, validated_data):
		if validated_data.has_key('password'):
			user = UserBase()
			user.set_password(validated_data['password'])
			validated_data['password'] = user.password
		validated_data['is_active'] = True
		validated_data['is_staff'] = True
		validated_data['is_superuser'] = True
		return super(UserSerializer, self).create(validated_data)

class UserWithTokenSerializer(UserSerializer):
	token = serializers.CharField(read_only=True)
	class Meta(UserSerializer.Meta):
		fields = UserSerializer.Meta.fields + ('token',)


'''
	Drink
'''


class DrinkCategorySerializer(serializers.ModelSerializer):
	link = serializers.SerializerMethodField('_name')
	main_level = serializers.SerializerMethodField('_main')
	class Meta:
		model = DrinkCategory
		fields = '__all__' 
	def _name(self, obj):
		link = str(obj.get_absolute_url()).title()[1:]
		return link.replace("/", ", ")

	def _main(self, obj):
		link = str(obj.get_main_level()).title()[1:]
		return int(link)

class DrinkCategorySmallSerializer(DrinkCategorySerializer):
	class Meta:
		model = DrinkCategory
		fields = ('id','link','main_level','name','image','main_level') 

class SeparateGlassSerializer(serializers.ModelSerializer):
	unit_view = serializers.SerializerMethodField(read_only=True)
	class Meta:
		model = SeparateGlass
		fields = '__all__' 

	def get_unit_view(self,obj):
		return obj.get_unit_display()

class GarnishSerializer(serializers.ModelSerializer):
	class Meta:
		model = Garnish
		fields = '__all__'

class IngredientSmallSerializer(serializers.ModelSerializer):
	class Meta:
		model = Ingredient
		fields = ('id','name',)
		
class DrinkGarnishSerializer(serializers.ModelSerializer):
	garnish = GarnishSerializer(read_only=True)
	class Meta:
		model = DrinkGarnish
		fields = ('id','garnish','ratio')

class DrinkIngredientSerializer(serializers.ModelSerializer):
	ingredient = IngredientSmallSerializer(read_only=True)
	unit = serializers.SerializerMethodField()
	class Meta:
		model = DrinkIngredient
		fields = ('ingredient','unit','ratio')

	def get_unit(self,obj):
		return obj.get_unit_display()


class DrinkUserOrdersSerializer(serializers.ModelSerializer):
	class Meta:
		model = Drink
		fields = ('id','name','image','price')

	def get_glass_ml(self,obj):
		return obj.glass.change_to_ml

class DrinkOrdersSerializer(DrinkUserOrdersSerializer):
	ingredients = DrinkIngredientSerializer(many=True, read_only=True)
	glass_ml = serializers.SerializerMethodField()
	class Meta(DrinkUserOrdersSerializer.Meta):
		model = Drink
		fields = DrinkUserOrdersSerializer.Meta.fields+('ingredients',\
			'total_part','glass_ml','ml_per_part')

def drink_add_on(self, ret=None):
	categories = self.initial_data.get('category',None)
	if categories:
		categories = categories.split(",")
		for category in categories:
			try:
				ret.category.add(DrinkCategory.objects.get(id=category))
			except Exception as e:
				ret.delete()
				raise e

	ingredients = self.initial_data.getlist('ingredients',None)
	if ingredients:
		for ingredient in ingredients:
			ingredient = ast.literal_eval(ingredient)
			try:
				ingre = DrinkIngredient(drink=ret, ingredient=Ingredient.objects.get(id=ingredient['ingredient']),
								ratio=ingredient['ratio'],
								unit=ingredient['unit'])
				ingre.save()
			except Exception as e:
				DrinkIngredient.objects.filter(drink=ret).delete()
				ret.delete()
				raise e
	else:
		ret.delete()
		raise api_utils.BadRequest("NOT INCLUDE ANY INGREDIENT, ADD ONE!")

	garnishes = self.initial_data.getlist('garnishes',None)
	if garnishes:
		for garnish in garnishes:
			print garnish
			garnish = ast.literal_eval(garnish)
			try:
				garn = DrinkGarnish(drink=ret, garnish=Garnish.objects.get(id=garnish['garnish']),
								ratio=garnish['ratio'],)
				garn.save()
			except Exception as e:
				DrinkIngredient.objects.filter(drink=ret).delete()
				DrinkGarnish.objects.filter(drink=ret).delete()
				ret.delete()
				raise e
	return ret


class DrinkSerializer(serializers.ModelSerializer):
	numbers_bought = serializers.IntegerField(read_only=True)
	category = DrinkCategorySmallSerializer(many=True, read_only=True)
	glass = SeparateGlassSerializer(read_only=True)
	ingredients = DrinkIngredientSerializer(many=True, read_only=True)
	garnishes = serializers.SerializerMethodField('_garnishes')
	creator = UserSerializer(read_only=True)
	class Meta:
		model = Drink
		fields = ('id','numbers_bought','category','glass','ingredients',
			'garnishes','name','image','image_background','price','creator','creation_date',
			'key_word','estimate_time','is_have_ice')
		# depth = 1

	def _garnishes(self, obj):
		qs = DrinkGarnish.objects.filter(drink=obj, garnish__active=True)
		serializer = DrinkGarnishSerializer(instance=qs, many=True)
		return serializer.data

class DrinkUpdateSerializer(DrinkSerializer):
	garnishes = DrinkGarnishSerializer(many=True, required=False, read_only=True)

	def update(self, instance, validated_data):
		ret = super(DrinkSerializer,self).update(instance, validated_data)
		ret.category.clear()
		ret.ingredients.all().delete()
		ret.garnishes.all().delete()
		ret = drink_add_on(self, ret)
		return ret

class DrinkCreateSerializer(serializers.ModelSerializer):
	ingredients = DrinkIngredientSerializer(many=True, required=False, read_only=True)
	garnishes = DrinkGarnishSerializer(many=True, required=False, read_only=True)
	category = DrinkCategorySmallSerializer(many=True, read_only=True)
	class Meta:
		model = Drink
		fields = ('id','numbers_bought','category','glass','ingredients',
			'garnishes','name','image','image_background','price','creator',
			'creation_date','key_word','estimate_time','is_have_ice')


	def create(self, validated_data):
		ret = Drink(**validated_data)
		ret.save()
		ret = drink_add_on(self, ret)
		return ret

'''
	Ingredient
'''
class IngredientTypeSerializer(serializers.ModelSerializer):
	class Meta:
		model = IngredientType
		fields = '__all__'

class IngredientBrandSerializer(serializers.ModelSerializer):
	class Meta:
		model = IngredientBrand
		fields = '__all__'

class IngredientCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Ingredient
		fields = '__all__'

class IngredientListSerializer(IngredientCreateSerializer):
	type = IngredientTypeSerializer(read_only=True)
	brand = IngredientBrandSerializer(read_only=True)


class IngredientHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = IngredientHistory
		fields = '__all__'


'''
	Robot
'''
class RobotSerializer(serializers.ModelSerializer):
	class Meta:
		model = Robot
		fields = ('status','creation_date','ingredients')
		depth = 1
'''
	Tab
'''
class AddToTabSerializer(serializers.ModelSerializer):
	user = UserSerializer(required=False, read_only=True)
	class Meta:
		model = Tab
		fields = '__all__'

class UserOrderTabSerializer(serializers.ModelSerializer):
	drink = DrinkUserOrdersSerializer(required=False, read_only=True)
	garnishes = DrinkGarnishSerializer(many=True)
	ice = serializers.SerializerMethodField()

	class Meta:
		model = Tab
		fields = ('drink','status','ice','garnishes','quantity')

	def get_ice(self,obj):
		return obj.get_ice_display()

class OrderTabSerializer(UserOrderTabSerializer):
	drink = DrinkOrdersSerializer(required=False, read_only=True)

'''
	Order
'''

class OrderSmallSerializer(serializers.ModelSerializer):
	# For user
	products = UserOrderTabSerializer(many=True, required=False, read_only=True)
	qr_code = serializers.SerializerMethodField(read_only=True)

	class Meta:
		model = Order
		fields = ('id','status','creation_date','amount',
			'channel','transaction_code','transaction_id',
			'payer_firstname','payer_lastname','payer_email',
			'tray_number','products','qr_code','photo')

	def get_qr_code(self,obj):
		return obj.qr_code

class OrderSerializer(OrderSmallSerializer):
	user = UserSerializer(required=False, read_only=True)
	class Meta(OrderSmallSerializer.Meta):
		model = Order
		fields = OrderSmallSerializer.Meta.fields+('robot','user')

class OrderMachineSerializer(OrderSerializer):
	'''
		Order with ingredient for machine create a drink
		Use in socket
	'''
	user = UserSerializer(required=False, read_only=True)
	products = OrderTabSerializer(many=True, required=False, read_only=True)
	class Meta(OrderSmallSerializer.Meta):
		model = Order

class UserWithOrderSerializer(UserSerializer):
	orders = OrderSmallSerializer(read_only=True, many=True, required=False,)
	class Meta(UserSerializer.Meta):
		fields = UserSerializer.Meta.fields + ('orders',)