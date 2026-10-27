from django.db.models import Sum
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Category, Transaction
from .serializers import CategorySerializer, RegisterSerializer, TransactionSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        qs = Category.objects.filter(user=self.request.user)
        kind = self.request.query_params.get('kind')
        if kind:
            qs = qs.filter(kind=kind)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user).select_related('category')
        kind = self.request.query_params.get('kind')
        if kind:
            qs = qs.filter(category__kind=kind)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related('category')


class SummaryView(APIView):
    def get(self, request):
        base = Transaction.objects.filter(user=request.user)
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


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
