from django.urls import path
from .views import VisitorLogListCreateView, VisitorLogDeleteView

urlpatterns = [
    path('visitor-log/', VisitorLogListCreateView.as_view(), name='visitor-log-list'),
    path('visitor-log/<int:pk>/', VisitorLogDeleteView.as_view(), name='visitor-log-delete'),
]
