from django.contrib import admin
from api.models import (
    UserPreference, Destination, DestinationImage, Hotel, Transport, 
    TravelPlan, Itinerary
)

# Register models for admin management

@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'budget', 'objective', 'accommodation_type', 'interest', 'num_travelers', 'created_at')
    search_fields = ('user__username', 'location')
    list_filter = ('budget', 'interest', 'objective', 'accommodation_type')
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Budget Preferences', {
            'fields': ('budget', 'budget_min', 'budget_max')
        }),
        ('Travel Preferences', {
            'fields': ('interest', 'location', 'objective', 'accommodation_type', 'num_travelers')
        }),
    )


# Inline admin for Destination Images
class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 1
    fields = ('image_url', 'caption', 'is_primary')


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'city', 'category', 'budget_level', 'is_active')
    search_fields = ('name', 'country', 'city', 'location')
    list_filter = ('category', 'budget_level', 'country', 'is_active')
    inlines = [DestinationImageInline]
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'country', 'city', 'location', 'description')
        }),
        ('Details', {
            'fields': ('category', 'best_season', 'avg_temperature', 'objectives_supported')
        }),
        ('Budget', {
            'fields': ('budget_level', 'budget_min', 'budget_max')
        }),
        ('Media & Booking', {
            'fields': ('image_url', 'booking_url')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    actions = ['activate_destinations', 'deactivate_destinations']
    
    def activate_destinations(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} destinations activated.")
    activate_destinations.short_description = "Activate selected destinations"
    
    def deactivate_destinations(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} destinations deactivated.")
    deactivate_destinations.short_description = "Deactivate selected destinations"


@admin.register(DestinationImage)
class DestinationImageAdmin(admin.ModelAdmin):
    list_display = ('destination', 'caption', 'is_primary', 'created_at')
    search_fields = ('destination__name', 'caption')
    list_filter = ('is_primary', 'destination')


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

