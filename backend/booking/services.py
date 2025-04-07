from rooms.models import Room
from booking.models import Booking

def auto_assign_room_to_student(student):
    available_room = Room.objects.filter(status="available").first()
    if not available_room:
        return None

    available_room.status = "occupied"
    available_room.save()
    

    Booking.objects.create(student=student, room=available_room)
    print(f"[DEBUG] Student: {student.username}")
    print(f"[DEBUG] Available Room: {available_room.room_number if available_room else 'None'}")
    
    return available_room
