from django.db import models
from rooms.models import Room


class GuestBooking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField()
    purpose = models.CharField(max_length=255)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    booked_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"{self.guest_name} - Room {self.room.room_number if self.room else 'Not assigned'} ({self.status})"
