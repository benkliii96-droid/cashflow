from django.contrib import admin

from .models import Category, Transaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'kind', 'created_at')
    list_filter = ('kind',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('amount', 'category', 'occurred_at')
    list_filter = ('category__kind',)
