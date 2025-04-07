# guest_booking/urls.py
from django.urls import path
from .views import GuestRoomBookingView, GuestBookingStatusUpdateView

urlpatterns = [
    path('book/', GuestRoomBookingView.as_view(), name='guest-book-room'),
    path('my-booking/', GuestRoomBookingView.as_view(), name='guest-my-booking'),
    path('<int:pk>/status/', GuestBookingStatusUpdateView.as_view(), name='guest-booking-status-update'),
     path('all/', GuestRoomBookingView.as_view(), name='guest-booking-list')
]
