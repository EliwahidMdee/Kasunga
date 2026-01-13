from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# User Preferences Model
class UserPreference(models.Model):
    BUDGET_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    INTEREST_CHOICES = [
        ('beach', 'Beach'),
        ('wildlife', 'Wildlife'),
        ('historical', 'Historical'),
        ('city_tour', 'City Tour'),
        ('adventure', 'Adventure'),
        ('culture', 'Culture'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preference')
    budget = models.CharField(max_length=10, choices=BUDGET_CHOICES, default='medium')
    interest = models.CharField(max_length=20, choices=INTEREST_CHOICES, default='beach')
    num_travelers = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Preferences"


# Destination Model
class Destination(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    description = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=[
        ('beach', 'Beach'),
        ('wildlife', 'Wildlife'),
        ('historical', 'Historical'),
        ('city_tour', 'City Tour'),
        ('adventure', 'Adventure'),
        ('culture', 'Culture'),
    ])
    best_season = models.CharField(max_length=100)
    avg_temperature = models.CharField(max_length=50)
    budget_level = models.CharField(max_length=10, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name}, {self.country}"


# Hotel Model
class Hotel(models.Model):
    STAR_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='hotels')
    name = models.CharField(max_length=200)
    stars = models.IntegerField(choices=STAR_CHOICES)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    budget_category = models.CharField(max_length=10, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ])
    description = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    amenities = models.TextField(help_text="Comma-separated amenities")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.destination.name}"


# Transport Model
class Transport(models.Model):
    TRANSPORT_TYPES = [
        ('bus', 'Bus'),
        ('train', 'Train'),
        ('flight', 'Flight'),
        ('car', 'Car'),
    ]
    
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    transport_type = models.CharField(max_length=20, choices=TRANSPORT_TYPES)
    distance_km = models.IntegerField()
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_hours = models.FloatField()
    availability = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.origin} to {self.destination} - {self.transport_type}"


# Travel Plan Model
class TravelPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='travel_plans')
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, blank=True)
    hotel = models.ForeignKey(Hotel, on_delete=models.SET_NULL, null=True, blank=True)
    transport = models.ForeignKey(Transport, on_delete=models.SET_NULL, null=True, blank=True)
    travel_date = models.DateField()
    return_date = models.DateField()
    budget = models.DecimalField(max_digits=15, decimal_places=2)
    num_travelers = models.IntegerField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s trip to {self.destination.name if self.destination else 'Unknown'}"


# Itinerary Model
class Itinerary(models.Model):
    travel_plan = models.OneToOneField(TravelPlan, on_delete=models.CASCADE, related_name='itinerary')
    day_number = models.IntegerField()
    activities = models.TextField()
    accommodation = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Itinerary for {self.travel_plan} - Day {self.day_number}"

