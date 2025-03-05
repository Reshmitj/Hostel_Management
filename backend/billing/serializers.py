from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()  # Returns student username instead of ID

    class Meta:
        model = Invoice
        fields = ["id", "student", "amount", "created_on"]
