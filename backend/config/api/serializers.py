from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import (
    UserPreference, Destination, DestinationImage, Hotel, Transport, 
    TravelPlan, Itinerary
)


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
    
    def create(self, validated_data):
        # Hash password on user creation
        user = User.objects.create_user(**validated_data)
        return user


# User Preference Serializer
class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = [
            'id', 'user', 'budget', 'budget_min', 'budget_max', 
            'interest', 'location', 'objective', 'accommodation_type',
            'num_travelers', 'created_at', 'updated_at'
        ]


# Destination Image Serializer
class DestinationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImage
        fields = ['id', 'destination', 'image_url', 'caption', 'is_primary', 'created_at']


# Destination Serializer
class DestinationSerializer(serializers.ModelSerializer):
    images = DestinationImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'country', 'city', 'description', 'location',
            'image_url', 'images', 'category', 'best_season', 'avg_temperature',
            'budget_level', 'budget_min', 'budget_max', 'objectives_supported',
            'is_active', 'booking_url', 'created_at'
        ]


# Hotel Serializer
class HotelSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    
    class Meta:
        model = Hotel
        fields = [
            'id', 'destination', 'destination_name', 'name', 'stars', 
            'price_per_night', 'budget_category', 'description', 
            'image_url', 'amenities', 'created_at'
        ]


# Transport Serializer
class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = [
            'id', 'origin', 'destination', 'transport_type', 
            'distance_km', 'estimated_price', 'duration_hours',
            'availability', 'created_at'
        ]


# Itinerary Serializer
class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = [
            'id', 'travel_plan', 'day_number', 'activities', 
            'accommodation', 'notes', 'created_at'
        ]


# Travel Plan Serializer
class TravelPlanSerializer(serializers.ModelSerializer):
    destination_details = DestinationSerializer(source='destination', read_only=True)
    hotel_details = HotelSerializer(source='hotel', read_only=True)
    transport_details = TransportSerializer(source='transport', read_only=True)
    itinerary = ItinerarySerializer(read_only=True)
    
    class Meta:
        model = TravelPlan
        fields = [
            'id', 'user', 'destination', 'destination_details', 
            'hotel', 'hotel_details', 'transport', 'transport_details',
            'travel_date', 'return_date', 'budget', 'num_travelers',
            'notes', 'itinerary', 'created_at', 'updated_at'
        ]
