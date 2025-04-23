from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.permissions import IsAuthenticated
from .models import GuestBooking
from rooms.models import Room
from .serializers import GuestBookingSerializer
from guest_booking.models import GuestBooking



class GuestRoomBookingView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Only logged-in users can access

    def post(self, request):
        user = request.user

        # Only guests can book rooms
        if user.role != "guest":
            return Response({"error": "Only guests can book rooms."}, status=status.HTTP_403_FORBIDDEN)

        # Prevent duplicate booking
        if GuestBooking.objects.filter(guest_email=user.email).exists():
              return Response({
        "message": "Room already booked.",
        "alreadyBooked": True  # ✅ custom flag
    }, status=status.HTTP_200_OK)

        data = request.data
        available_room = Room.objects.filter(status='available').first()
        if not available_room:
            return Response({"error": "No available rooms"}, status=status.HTTP_400_BAD_REQUEST)

        booking = GuestBooking.objects.create(
            guest_name=user.username,
            guest_email=user.email,
            purpose=data.get('purpose'),
            room=available_room,
            status="pending"  # Default status
        )

        # Mark room as occupied
        available_room.status = 'occupied'
        available_room.save()

        serializer = GuestBookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        user = request.user

        # Allow both guest and admin to view bookings
        if user.role == "admin":
            bookings = GuestBooking.objects.all()  # Admin can see all bookings
        elif user.role == "guest":
            booking = GuestBooking.objects.filter(guest_email=user.email, status="approved").first()
            if not booking:
                return Response(status=status.HTTP_204_NO_CONTENT)
            serializer = GuestBookingSerializer(booking)
            return Response(serializer.data)
        else:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = GuestBookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GuestBookingStatusUpdateView(generics.UpdateAPIView):
    queryset = GuestBooking.objects.all()
    serializer_class = GuestBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        # Only admin can approve or reject requests
        if request.user.role != "admin":
            return Response({"error": "Only admins can approve or reject requests."}, status=403)

        booking = self.get_object()
        status_value = request.data.get("status")

        if status_value not in ["approved", "rejected"]:
            return Response({"error": "Invalid status value."}, status=400)

        # Update the booking status
        booking.status = status_value
        booking.save()

        return Response({"message": f"Booking has been {status_value}."})
