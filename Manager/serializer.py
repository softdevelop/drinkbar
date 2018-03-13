
from rest_framework import fields, serializers
from models import *

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
    class Meta:
        model = UserBase
        fields = ('id','username','password','email','avatar','birthday','avatar_url', 'first_name','last_name', 'fb_uid', 'opt', 
            'is_email_verified', 'avatar_url', 'is_active', 'is_staff', 'is_superuser', 'last_login', 'date_joined')
        extra_kwargs = {'password': {'write_only': True},
                        'username': {'write_only': True},}

    def create(self, validated_data):
        if validated_data.has_key('password'):
            user = UserBase()
            user.set_password(validated_data['password'])
            validated_data['password'] = user.password
        validated_data['is_staff'] = True
        validated_data['is_superuser'] = True
        return super(UserSerializer, self).create(validated_data)

class UserWithTokenSerializer(UserSerializer):
    token = serializers.CharField(read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('token',)

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
    class Meta:
        model = SeparateGlass
        fields = '__all__' 

class GarnishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garnish
        fields = '__all__' 

class DrinkIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrinkIngredient
        fields = '__all__'

class DrinkSerializer(serializers.ModelSerializer):
    numbers_bought = serializers.IntegerField(read_only=True)
    category = DrinkCategorySmallSerializer(read_only=True)
    glass = SeparateGlassSerializer(read_only=True)
    ingredients = DrinkIngredientSerializer(many=True, read_only=True)
    garnishes = serializers.SerializerMethodField('_garnishes')
    class Meta:
        model = Drink
        fields = ('id','numbers_bought','category','glass','ingredients',
            'garnishes','name','image','price')
        # depth = 1

    def _garnishes(self, obj):
        qs = Garnish.objects.filter(drink=obj, active=True)
        serializer = GarnishSerializer(instance=qs, many=True)
        return serializer.data

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'
