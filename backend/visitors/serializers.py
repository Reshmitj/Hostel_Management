from rest_framework import serializers
from .models import VisitorLog

class VisitorLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorLog
        fields = '__all__'
