from rest_framework import serializers
from .models import GuestBooking
from rooms.models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['room_number', 'type']

class GuestBookingSerializer(serializers.ModelSerializer):
    room = RoomSerializer()
    status = serializers.CharField(read_only=True)  # ✅ Include status in response

    class Meta:
        model = GuestBooking
        fields = ['id','guest_name', 'guest_email', 'purpose', 'room', 'booked_on', 'status']
