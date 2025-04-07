from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .services import auto_assign_room_to_student
from booking.models import Booking
from rooms.serializers import RoomSerializer  

class BookRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "student":
            return Response({"error": "Only students can book rooms."}, status=status.HTTP_403_FORBIDDEN)

        if Booking.objects.filter(student=user).exists():
            return Response({"message": "Room already assigned."}, status=status.HTTP_200_OK)

        room = auto_assign_room_to_student(user)
        if room:
            return Response({"message": f"Room {room.room_number} assigned successfully."})
        else:
            return Response({"error": "No rooms available."}, status=status.HTTP_400_BAD_REQUEST)

class AssignedRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "student":
            return Response({"error": "Only students can access assigned rooms."}, status=status.HTTP_403_FORBIDDEN)

        try:
            booking = Booking.objects.select_related("room").get(student=user)
            room = booking.room
            return Response({
                "room_number": room.room_number,
                "type": room.type,
                "status": room.status
            }, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"message": "No room assigned."}, status=status.HTTP_404_NOT_FOUND)