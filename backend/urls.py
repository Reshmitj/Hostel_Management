from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),  path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), # ✅ This must be present
    path('rooms/', include('rooms.urls')),  # ✅ Include Room Management API
    path('api/booking/', include('booking.urls')),
    path('api/guest-booking/', include('guest_booking.urls')),
]
