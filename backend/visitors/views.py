from rest_framework import generics
from .models import VisitorLog
from .serializers import VisitorLogSerializer
from rest_framework.permissions import IsAuthenticated

class VisitorLogListCreateView(generics.ListCreateAPIView):
    queryset = VisitorLog.objects.all()
    serializer_class = VisitorLogSerializer
    permission_classes = [IsAuthenticated]  # Protect with authentication

class VisitorLogDeleteView(generics.DestroyAPIView):
    queryset = VisitorLog.objects.all()
    serializer_class = VisitorLogSerializer
    permission_classes = [IsAuthenticated]
