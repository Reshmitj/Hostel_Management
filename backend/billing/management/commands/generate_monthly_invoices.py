# billing/management/commands/generate_monthly_invoices.py

from django.core.management.base import BaseCommand
from billing.models import Invoice
from authentication.models import CustomUser
from billing.utils import send_invoice_email
from datetime import date
from decimal import Decimal

class Command(BaseCommand):
    help = "Auto-generate monthly invoices for all students and guests"

    def handle(self, *args, **kwargs):
        today = date.today()

        # Prevent duplicate monthly invoices
        if Invoice.objects.filter(created_on__month=today.month, created_on__year=today.year).exists():
            self.stdout.write(self.style.WARNING("Invoices already generated for this month."))
            return

        users = CustomUser.objects.filter(role__in=["student", "guest"])
        count = 0

        for user in users:
            amount = Decimal("1000.00") if user.role == "student" else Decimal("1500.00")
            invoice = Invoice.objects.create(student=user, amount=amount, created_on=today)
            send_invoice_email(user, amount)
            count += 1

        self.stdout.write(self.style.SUCCESS(f"{count} invoices generated and emails sent."))
