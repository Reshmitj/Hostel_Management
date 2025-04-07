from django.urls import path
from .views import BookRoomView, AssignedRoomView

urlpatterns = [
    path("book-room/", BookRoomView.as_view(), name="book-room"),
    path("assigned-room/", AssignedRoomView.as_view(), name="assigned-room"),  # ✅ new line

]
