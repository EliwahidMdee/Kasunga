from django.contrib import admin
from api.models import (
    UserPreference, Destination, Hotel, Transport, 
    TravelPlan, Itinerary
)

# Register models for admin management

@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'budget', 'interest', 'num_travelers', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('budget', 'interest')


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'city', 'category', 'budget_level')
    search_fields = ('name', 'country', 'city')
    list_filter = ('category', 'budget_level', 'country')
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'country', 'city', 'description')
        }),
        ('Details', {
            'fields': ('category', 'best_season', 'avg_temperature', 'budget_level')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
    )


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'destination', 'stars', 'price_per_night', 'budget_category')
    search_fields = ('name', 'destination__name')
    list_filter = ('stars', 'budget_category', 'destination')
    fieldsets = (
        ('Basic Info', {
            'fields': ('destination', 'name', 'description')
        }),
        ('Details', {
            'fields': ('stars', 'price_per_night', 'budget_category')
        }),
        ('Amenities', {
            'fields': ('amenities', 'image_url')
        }),
    )


@admin.register(Transport)
class TransportAdmin(admin.ModelAdmin):
    list_display = ('origin', 'destination', 'transport_type', 'distance_km', 'estimated_price')
    search_fields = ('origin', 'destination')
    list_filter = ('transport_type',)
    fieldsets = (
        ('Route', {
            'fields': ('origin', 'destination')
        }),
        ('Details', {
            'fields': ('transport_type', 'distance_km', 'duration_hours')
        }),
        ('Pricing & Availability', {
            'fields': ('estimated_price', 'availability')
        }),
    )


@admin.register(TravelPlan)
class TravelPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'destination', 'travel_date', 'return_date', 'budget')
    search_fields = ('user__username', 'destination__name')
    list_filter = ('travel_date', 'user')
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Trip Details', {
            'fields': ('destination', 'travel_date', 'return_date', 'num_travelers')
        }),
        ('Services', {
            'fields': ('hotel', 'transport', 'budget')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ('travel_plan', 'day_number', 'created_at')
    search_fields = ('travel_plan__user__username',)
    list_filter = ('day_number', 'travel_plan__user')
    fieldsets = (
        ('Trip', {
            'fields': ('travel_plan', 'day_number')
        }),
        ('Details', {
            'fields': ('activities', 'accommodation')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )

