from django.contrib import admin
from django.urls import path, include  # ✅ Import 'include' to include other apps' URLs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),  # ✅ Add this to include authentication URLs
     path("", include("visitors.urls")),
]
