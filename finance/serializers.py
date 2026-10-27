from rest_framework import serializers

from .models import Category, Transaction


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
