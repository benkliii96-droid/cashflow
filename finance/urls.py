from django.urls import path

from .views import (
    CategoryDetailView,
    CategoryListCreateView,
    LoginView,
    RegisterView,
    SummaryView,
    TransactionDetailView,
    TransactionListCreateView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('categories/', CategoryListCreateView.as_view()),
    path('categories/<int:pk>/', CategoryDetailView.as_view()),
    path('transactions/', TransactionListCreateView.as_view()),
    path('transactions/<int:pk>/', TransactionDetailView.as_view()),
    path('summary/', SummaryView.as_view()),
]
