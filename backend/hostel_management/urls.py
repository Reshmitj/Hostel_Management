from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),  # ✅ Ensure authentication URLs are prefixed with `api/auth/`
    path('api/rooms/', include('rooms.urls')),  # ✅ Now matches frontend
    path('api/billing/', include('billing.urls')),  # ✅ Now matches frontend
    path('api/visitor-log/', include('visitors.urls')),  # ✅ Ensure correct URL for visitors
]
