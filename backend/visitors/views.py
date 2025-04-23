from rest_framework import generics
from .models import VisitorLog
from .serializers import VisitorLogSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class VisitorLogListCreateView(generics.ListCreateAPIView):
    queryset = VisitorLog.objects.all()
    serializer_class = VisitorLogSerializer
    permission_classes = [IsAuthenticated]  # Protect with authentication

class VisitorLogDeleteView(generics.DestroyAPIView):
    queryset = VisitorLog.objects.all()
    serializer_class = VisitorLogSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except:
            return Response({"error": "Visitor log not found."}, status=status.HTTP_404_NOT_FOUND)

