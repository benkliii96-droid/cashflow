from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        qs = Category.objects.all()
        kind = self.request.query_params.get('kind')
        if kind:
            qs = qs.filter(kind=kind)
        return qs


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.select_related('category')
        kind = self.request.query_params.get('kind')
        if kind:
            qs = qs.filter(category__kind=kind)
        return qs


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.select_related('category')
    serializer_class = TransactionSerializer


class SummaryView(APIView):
    def get(self, request):
        base = Transaction.objects.all()
        income = (
            base.filter(category__kind='income').aggregate(total=Sum('amount'))['total'] or 0
        )
        expense = (
            base.filter(category__kind='expense').aggregate(total=Sum('amount'))['total'] or 0
        )
        return Response(
            {
                'income': str(income),
                'expense': str(expense),
                'balance': str(income - expense),
            },
            status=status.HTTP_200_OK,
        )
