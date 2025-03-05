from django.urls import path
from .views import InvoiceListView, GenerateInvoicesView

urlpatterns = [
    path('invoices/', InvoiceListView.as_view(), name="invoice-list"),
    path('generate/', GenerateInvoicesView.as_view(), name="generate-invoices"),  # ✅ Add invoice generation
]
