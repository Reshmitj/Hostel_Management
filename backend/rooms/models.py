from django.db import models

class Room(models.Model):
    ROOM_TYPES = [
        ("single", "Single"),
        ("double", "Double"),
        ("suite", "Suite"),
    ]

    STATUS_CHOICES = [
        ("available", "Available"),
        ("occupied", "Occupied"),
        ("maintenance", "Under Maintenance"),
    ]

    room_number = models.CharField(max_length=10, unique=True)
    type = models.CharField(max_length=10, choices=ROOM_TYPES, default="single")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="available")

    def __str__(self):
        return f"Room {self.room_number} - {self.get_type_display()} - {self.get_status_display()}"
