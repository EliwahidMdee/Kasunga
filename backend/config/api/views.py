from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from api.models import (
    UserPreference, Destination, Hotel, Transport, 
    TravelPlan, Itinerary
)
from api.serializers import (
    UserSerializer, UserPreferenceSerializer, DestinationSerializer,
    HotelSerializer, TransportSerializer, TravelPlanSerializer,
    ItinerarySerializer
)
from datetime import timedelta


# ==================== RULE-BASED RECOMMENDATION ENGINE ====================

class RecommendationEngine:
    """
    Rule-based recommendation engine that follows IF-ELSE logic
    to recommend destinations, hotels, and transport options.
    """
    
    @staticmethod
    def recommend_destinations(budget, interest, country=None):
        """
        Rule 1: Recommend destinations based on budget and interest
        IF budget = Low → show budget-friendly destinations
        IF interest = Beach → show beach destinations
        IF country is specified → filter by country
        """
        query = Destination.objects.all()
        
        # Rule: Match budget level
        if budget:
            query = query.filter(budget_level=budget)
        
        # Rule: Match interest category
        if interest:
            query = query.filter(category=interest)
        
        # Rule: Filter by country if specified
        if country:
            query = query.filter(country=country)
        
        return query
    
    @staticmethod
    def recommend_hotels(destination_id, budget):
        """
        Rule 2: Recommend hotels based on destination and budget
        IF budget = Low → show guest houses/budget hotels (1-2 stars)
        IF budget = Medium → show 3-star hotels
        IF budget = High → show 4-5 star hotels
        """
        if budget == 'low':
            star_range = [1, 2]
        elif budget == 'medium':
            star_range = [3]
        elif budget == 'high':
            star_range = [4, 5]
        else:
            star_range = [1, 2, 3, 4, 5]
        
        return Hotel.objects.filter(
            destination_id=destination_id,
            stars__in=star_range,
            budget_category=budget
        )
    
    @staticmethod
    def recommend_transport(distance_km, budget):
        """
        Rule 3: Recommend transport based on distance and budget
        IF distance < 200km → Bus
        IF distance 200-1000km → Train
        IF distance > 1000km → Flight
        Budget consideration affects price selection
        """
        if distance_km < 200:
            transport_type = 'bus'
        elif distance_km <= 1000:
            transport_type = 'train'
        else:
            transport_type = 'flight'
        
        return Transport.objects.filter(transport_type=transport_type)
    
    @staticmethod
    def generate_itinerary(travel_days, destination_id, num_travelers):
        """
        Rule 4: Generate itinerary based on trip duration
        Day 1: Arrival and hotel check-in
        Middle days: Attractions and activities
        Last day: Rest and return
        """
        itinerary_template = []
        
        if travel_days == 1:
            itinerary_template.append({
                'day': 1,
                'activities': 'Arrival, Hotel Check-in, Evening city exploration'
            })
        elif travel_days == 2:
            itinerary_template.append({
                'day': 1,
                'activities': 'Arrival, Hotel Check-in, Evening city tour'
            })
            itinerary_template.append({
                'day': 2,
                'activities': 'Main attractions visit, Lunch, Return'
            })
        else:
            # Day 1
            itinerary_template.append({
                'day': 1,
                'activities': 'Arrival, Hotel Check-in, Evening exploration'
            })
            
            # Middle days - activities
            for day in range(2, travel_days):
                if day % 2 == 0:
                    itinerary_template.append({
                        'day': day,
                        'activities': 'Main attractions visit, Cultural experience, Lunch'
                    })
                else:
                    itinerary_template.append({
                        'day': day,
                        'activities': 'Adventure activities, Local food, Evening relaxation'
                    })
            
            # Last day
            itinerary_template.append({
                'day': travel_days,
                'activities': 'Shopping, Last-minute sightseeing, Hotel checkout, Return'
            })
        
        return itinerary_template


# ==================== VIEWSETS ====================

class UserViewSet(viewsets.ModelViewSet):
    """User registration and profile management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Handle user registration"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {'message': 'User registered successfully', 'user': serializer.data},
            status=status.HTTP_201_CREATED
        )


class UserPreferenceViewSet(viewsets.ModelViewSet):
    """User travel preferences management"""
    queryset = UserPreference.objects.all()
    serializer_class = UserPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Each user sees only their own preferences
        return UserPreference.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get', 'post'])
    def my_preferences(self, request):
        """Get or create user's preferences"""
        try:
            preference = UserPreference.objects.get(user=request.user)
            serializer = self.get_serializer(preference)
            return Response(serializer.data)
        except UserPreference.DoesNotExist:
            return Response({'message': 'No preferences set'}, status=status.HTTP_404_NOT_FOUND)


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    """Destination management and recommendations"""
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Get recommended destinations based on user preferences
        Query params: budget, interest, country
        """
        budget = request.query_params.get('budget')
        interest = request.query_params.get('interest')
        country = request.query_params.get('country')
        
        destinations = RecommendationEngine.recommend_destinations(
            budget=budget,
            interest=interest,
            country=country
        )
        
        serializer = self.get_serializer(destinations, many=True)
        return Response({
            'count': destinations.count(),
            'recommendations': serializer.data
        })


class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    """Hotel management and recommendations"""
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Get recommended hotels based on destination and budget
        Query params: destination_id, budget
        """
        destination_id = request.query_params.get('destination_id')
        budget = request.query_params.get('budget')
        
        if not destination_id:
            return Response(
                {'error': 'destination_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        hotels = RecommendationEngine.recommend_hotels(destination_id, budget)
        serializer = self.get_serializer(hotels, many=True)
        return Response({
            'count': hotels.count(),
            'recommendations': serializer.data
        })


class TransportViewSet(viewsets.ReadOnlyModelViewSet):
    """Transport management and recommendations"""
    queryset = Transport.objects.all()
    serializer_class = TransportSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Get recommended transport based on distance and budget
        Query params: distance_km, budget
        """
        distance_km = request.query_params.get('distance_km')
        budget = request.query_params.get('budget')
        
        if not distance_km:
            return Response(
                {'error': 'distance_km is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            distance_km = int(distance_km)
        except ValueError:
            return Response(
                {'error': 'distance_km must be an integer'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transport = RecommendationEngine.recommend_transport(distance_km, budget)
        serializer = self.get_serializer(transport, many=True)
        return Response({
            'count': transport.count(),
            'recommendations': serializer.data
        })


class TravelPlanViewSet(viewsets.ModelViewSet):
    """Travel plan management and itinerary generation"""
    queryset = TravelPlan.objects.all()
    serializer_class = TravelPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users see only their own travel plans
        return TravelPlan.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically assign current user
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def generate_itinerary(self, request, pk=None):
        """
        Generate itinerary for a travel plan
        Automatically calculates days and creates itinerary
        """
        travel_plan = self.get_object()
        
        # Calculate trip duration
        travel_days = (travel_plan.return_date - travel_plan.travel_date).days + 1
        
        if travel_days <= 0:
            return Response(
                {'error': 'Return date must be after travel date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate itinerary using rule-based engine
        itinerary_template = RecommendationEngine.generate_itinerary(
            travel_days,
            travel_plan.destination_id,
            travel_plan.num_travelers
        )
        
        # Create itinerary objects
        itinerary_objects = []
        for item in itinerary_template:
            itinerary = Itinerary.objects.create(
                travel_plan=travel_plan,
                day_number=item['day'],
                activities=item['activities']
            )
            itinerary_objects.append(itinerary)
        
        serializer = ItinerarySerializer(itinerary_objects, many=True)
        return Response({
            'message': f'Itinerary generated for {travel_days} days',
            'itinerary': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def create_plan_with_recommendations(self, request):
        """
        Create a complete travel plan with recommendations
        Body: travel_date, return_date, budget, num_travelers, interest, country
        """
        travel_date = request.data.get('travel_date')
        return_date = request.data.get('return_date')
        budget = request.data.get('budget')
        num_travelers = request.data.get('num_travelers')
        interest = request.data.get('interest')
        country = request.data.get('country')
        
        if not all([travel_date, return_date, budget, num_travelers]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Step 1: Get recommended destinations
        destinations = RecommendationEngine.recommend_destinations(budget, interest, country)
        
        if not destinations.exists():
            return Response(
                {'error': 'No destinations found matching your criteria'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Step 2: Select first recommended destination
        destination = destinations.first()
        
        # Step 3: Get recommended hotels
        hotels = RecommendationEngine.recommend_hotels(destination.id, budget)
        hotel = hotels.first() if hotels.exists() else None
        
        # Step 4: Get recommended transport (dummy distance for now)
        transport = RecommendationEngine.recommend_transport(500, budget)
        transport_obj = transport.first() if transport.exists() else None
        
        # Step 5: Create travel plan
        travel_plan = TravelPlan.objects.create(
            user=request.user,
            destination=destination,
            hotel=hotel,
            transport=transport_obj,
            travel_date=travel_date,
            return_date=return_date,
            budget=budget,
            num_travelers=num_travelers
        )
        
        # Step 6: Generate itinerary
        travel_days = (travel_plan.return_date - travel_plan.travel_date).days + 1
        itinerary_template = RecommendationEngine.generate_itinerary(
            travel_days,
            destination.id,
            num_travelers
        )
        
        for item in itinerary_template:
            Itinerary.objects.create(
                travel_plan=travel_plan,
                day_number=item['day'],
                activities=item['activities']
            )
        
        serializer = self.get_serializer(travel_plan)
        return Response({
            'message': 'Travel plan created with recommendations',
            'travel_plan': serializer.data
        }, status=status.HTTP_201_CREATED)


class ItineraryViewSet(viewsets.ModelViewSet):
    """Itinerary management"""
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users see itineraries for their travel plans
        return Itinerary.objects.filter(travel_plan__user=self.request.user)

