"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from api import views

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'preferences', views.UserPreferenceViewSet)
router.register(r'destinations', views.DestinationViewSet)
router.register(r'hotels', views.HotelViewSet)
router.register(r'transports', views.TransportViewSet)
router.register(r'travel-plans', views.TravelPlanViewSet)
router.register(r'itineraries', views.ItineraryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Authentication endpoints
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/logout/', views.logout_view, name='logout'),
    path('api/auth/change-password/', views.change_password_view, name='change_password'),
    path('api/auth-token/', obtain_auth_token, name='api_token_auth'),
    
    # Budget tracking endpoints
    path('api/budget/summary/', views.budget_summary, name='budget_summary'),
    path('api/budget/breakdown/<int:plan_id>/', views.budget_breakdown, name='budget_breakdown'),
    
    # Dashboard endpoints
    path('api/dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('api/dashboard/upcoming-trips/', views.upcoming_trips, name='upcoming_trips'),
    path('api/dashboard/past-trips/', views.past_trips, name='past_trips'),
    
    # Admin management endpoints
    path('api/admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('api/admin/users/', views.admin_users_list, name='admin_users_list'),
    path('api/admin/users/<int:user_id>/', views.admin_user_details, name='admin_user_details'),
    path('api/admin/users/<int:user_id>/toggle-status/', views.admin_toggle_user_status, name='admin_toggle_user_status'),
    path('api/admin/travel-plans/', views.admin_all_travel_plans, name='admin_all_travel_plans'),
    path('api/admin/preferences-tracking/', views.admin_preferences_tracking, name='admin_preferences_tracking'),
    
    # Django REST Framework browsable API auth
    path('api-auth/', include('rest_framework.urls')),
]

