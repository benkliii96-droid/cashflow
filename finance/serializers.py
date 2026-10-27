from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Category, Transaction


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'username', 'password')

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'kind', 'created_at')
        read_only_fields = ('id', 'created_at')


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    kind = serializers.CharField(source='category.kind', read_only=True)

    class Meta:
        model = Transaction
        fields = (
            'id',
            'category',
            'category_name',
            'kind',
            'amount',
            'note',
            'occurred_at',
            'created_at',
        )
        read_only_fields = ('id', 'created_at', 'category_name', 'kind')

    def validate_category(self, category):
        request = self.context['request']
        if category.user_id != request.user.id:
            raise serializers.ValidationError('Category not found.')
        return category
