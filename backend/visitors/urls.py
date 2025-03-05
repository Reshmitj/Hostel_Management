from django.urls import path
from .views import VisitorLogListCreateView, VisitorLogDeleteView

urlpatterns = [
    path('', VisitorLogListCreateView.as_view(), name='visitor-log-list'),
    path('<int:pk>/', VisitorLogDeleteView.as_view(), name='visitor-log-delete'),
]
