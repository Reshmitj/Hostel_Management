from django.db import models
from authentication.models import CustomUser
from rooms.models import Room  # Assuming your Room model is here

class Booking(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    booked_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} -> Room {self.room.room_number}"
