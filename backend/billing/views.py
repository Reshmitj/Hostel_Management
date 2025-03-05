from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Invoice
from .serializers import InvoiceSerializer
from authentication.models import CustomUser
from datetime import date
from decimal import Decimal

class InvoiceListView(generics.ListAPIView):
    """ ✅ View all invoices (Admin sees all, Students see their own) """
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Invoice.objects.all() if user.role == "admin" else Invoice.objects.filter(student=user)


class GenerateInvoicesView(APIView):
    """ ✅ Generate invoices for all students (Admin only) """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Check if invoices for this month already exist
        today = date.today()
        if Invoice.objects.filter(created_on__month=today.month, created_on__year=today.year).exists():
            return Response({"error": "Invoices for this month already exist"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch all students and create invoices
        students = CustomUser.objects.filter(role="student")
        invoices = [
            Invoice(student=student, amount=Decimal("500.00"), created_on=today)
            for student in students
        ]
        Invoice.objects.bulk_create(invoices)  # Optimized bulk insert

        return Response({"message": f"{len(invoices)} invoices generated successfully"}, status=status.HTTP_201_CREATED)
