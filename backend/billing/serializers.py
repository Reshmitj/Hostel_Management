from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()  # ✅ Show student username

    class Meta:
        model = Invoice
        fields = ["id", "student", "amount", "created_on"]
