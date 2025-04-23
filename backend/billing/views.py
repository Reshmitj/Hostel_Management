from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.models import CustomUser
from .models import Invoice
from .serializers import InvoiceSerializer
from rest_framework import status
from .utils import send_invoice_email
from booking.models import Booking
from guest_booking.models import GuestBooking
from datetime import date
from decimal import Decimal
from calendar import month_name

class InvoiceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == "admin":
            invoices = Invoice.objects.all()
        else:
            invoices = Invoice.objects.filter(student=user)

        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)


class GenerateInvoicesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        today = date.today()
        month_label = month_name[today.month]

        if Invoice.objects.filter(created_on__month=today.month, created_on__year=today.year).exists():
            return Response(
                {"error": f"Invoices for {month_label} {today.year} already exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        users = CustomUser.objects.filter(role__in=["student", "guest"])
        invoices = []

        for user in users:
            if user.role == "student" and Booking.objects.filter(student=user).exists():
                amount = Decimal("1000.00")
            elif user.role == "guest" and GuestBooking.objects.filter(guest_email=user.email).exists():
                amount = Decimal("1500.00")
            else:
                continue

            invoice = Invoice(student=user, amount=amount, created_on=today)
            invoice.save()
            send_invoice_email(user, amount)
            invoices.append(invoice)

        return Response({"message": f"{len(invoices)} invoices generated and emails sent."}, status=status.HTTP_201_CREATED)