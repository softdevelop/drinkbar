
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
    email = serializers.CharField(read_only=True)
    class Meta:
        model = UserBase
        fields = ('email','avatar','birthday','avatar_url')

class UserWithTokenSerializer(UserSerializer):
    token = serializers.CharField(read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('token',)