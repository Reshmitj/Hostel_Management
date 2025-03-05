from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Invoice
from .serializers import InvoiceSerializer
from authentication.models import CustomUser

class InvoiceListView(generics.ListAPIView):
    """ ✅ View all invoices (Admin only) """
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """✅ Admin can see all invoices, students only see their own"""
        user = self.request.user
        if user.role == "admin":
            return Invoice.objects.all()
        return Invoice.objects.filter(student=user)
