from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterUserView, LoginView, AdminUserViewSet

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename="admin-users")

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),  # ✅ Enables admin API routes
    path('admin-users/', AdminUserViewSet.as_view({'get': 'admin_users'}), name='admin-users'),  
    path('admin-users/create_user/', AdminUserViewSet.as_view({'post': 'create_user'}), name='create-user'),  # ✅ Added this route
]
