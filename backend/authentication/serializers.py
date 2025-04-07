from rest_framework import serializers
from authentication.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """ Ensure password is hashed when creating a user """
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student')  # Default role: student
        )
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    """ Serializer for listing and updating user details """
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']
