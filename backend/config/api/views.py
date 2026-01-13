from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Sum, Avg, Q
from api.models import (
    UserPreference, Destination, DestinationImage, Hotel, Transport, 
    TravelPlan, Itinerary
)
from api.serializers import (
    UserSerializer, UserPreferenceSerializer, DestinationSerializer,
    DestinationImageSerializer, HotelSerializer, TransportSerializer, 
    TravelPlanSerializer, ItinerarySerializer
)
from datetime import timedelta, datetime
from decimal import Decimal


# ==================== RULE-BASED RECOMMENDATION ENGINE ====================

class RecommendationEngine:
    """
    Rule-based recommendation engine that follows IF-ELSE logic
    to recommend destinations, hotels, and transport options.
    """
    
    @staticmethod
    def recommend_destinations(budget=None, interest=None, country=None, budget_min=None, budget_max=None, objective=None, location=None):
        """
        Enhanced Rule: Recommend destinations based on multiple criteria
        IF budget_min/budget_max provided → filter by budget range
        IF interest provided → show matching category destinations
        IF country is specified → filter by country
        IF objective provided → filter by objectives_supported
        IF location provided → filter by location
        Only show active destinations
        """
        query = Destination.objects.filter(is_active=True)
        
        # Rule: Match budget range if specified
        if budget_min is not None:
            query = query.filter(budget_min__gte=budget_min)
        if budget_max is not None:
            query = query.filter(budget_max__lte=budget_max)
        
        # Rule: Match budget level (fallback)
        if budget:
            query = query.filter(budget_level=budget)
        
        # Rule: Match interest category
        if interest:
            query = query.filter(category=interest)
        
        # Rule: Filter by country if specified
        if country:
            query = query.filter(country__icontains=country)
            
        # Rule: Filter by location if specified
        if location:
            query = query.filter(Q(location__icontains=location) | Q(city__icontains=location) | Q(country__icontains=location))
        
        # Rule: Filter by objective if specified
        if objective:
            query = query.filter(objectives_supported__contains=[objective])
        
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


# ==================== AUTHENTICATION VIEWS ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    User login endpoint - returns token on successful authentication
    Body: username, password
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get or create token
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'message': 'Login successful'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint - deletes the user's token
    """
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'})
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Change user password
    Body: old_password, new_password
    """
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response(
            {'error': 'Both old and new passwords are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = request.user
    
    if not user.check_password(old_password):
        return Response(
            {'error': 'Old password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    
    # Update token
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    
    return Response({
        'message': 'Password changed successfully',
        'token': token.key
    })


# ==================== VIEWSETS ====================

class UserViewSet(viewsets.ModelViewSet):
    """User registration and profile management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """Allow anyone to register, but require auth for profile"""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Handle user registration"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Create token for the new user
        user = User.objects.get(username=serializer.data['username'])
        token = Token.objects.create(user=user)
        
        return Response(
            {
                'message': 'User registered successfully',
                'user': serializer.data,
                'token': token.key
            },
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        """Update current user's profile"""
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        })
    
    @action(detail=False, methods=['delete'])
    def delete_account(self, request):
        """Delete current user's account"""
        user = request.user
        username = user.username
        user.delete()
        return Response({
            'message': f'Account {username} deleted successfully'
        })


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
    queryset = Destination.objects.filter(is_active=True)
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Override to only show active destinations"""
        return Destination.objects.filter(is_active=True)
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Get recommended destinations based on user preferences
        Query params: budget, interest, country, budget_min, budget_max, objective, location
        """
        budget = request.query_params.get('budget')
        interest = request.query_params.get('interest')
        country = request.query_params.get('country')
        budget_min = request.query_params.get('budget_min')
        budget_max = request.query_params.get('budget_max')
        objective = request.query_params.get('objective')
        location = request.query_params.get('location')
        
        # Convert budget strings to Decimal if provided
        if budget_min:
            try:
                budget_min = Decimal(budget_min)
            except:
                budget_min = None
        if budget_max:
            try:
                budget_max = Decimal(budget_max)
            except:
                budget_max = None
        
        destinations = RecommendationEngine.recommend_destinations(
            budget=budget,
            interest=interest,
            country=country,
            budget_min=budget_min,
            budget_max=budget_max,
            objective=objective,
            location=location
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


class DestinationImageViewSet(viewsets.ReadOnlyModelViewSet):
    """Destination images management"""
    queryset = DestinationImage.objects.all()
    serializer_class = DestinationImageSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Filter by destination if provided
        destination_id = self.request.query_params.get('destination_id')
        if destination_id:
            return DestinationImage.objects.filter(destination_id=destination_id)
        return DestinationImage.objects.all()


# ==================== BUDGET TRACKING VIEWS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_summary(request):
    """
    Get budget summary for user's travel plans
    Shows total planned budget, spent budget, and remaining budget
    """
    user = request.user
    travel_plans = TravelPlan.objects.filter(user=user)
    
    total_budget = Decimal('0.00')
    total_spent = Decimal('0.00')
    
    plans_data = []
    for plan in travel_plans:
        # Calculate plan budget
        plan_budget = Decimal(str(plan.budget)) if plan.budget else Decimal('0.00')
        
        # Calculate estimated costs
        hotel_cost = Decimal('0.00')
        transport_cost = Decimal('0.00')
        
        if plan.hotel:
            nights = (plan.return_date - plan.travel_date).days
            hotel_cost = Decimal(str(plan.hotel.price_per_night)) * nights * plan.num_travelers
        
        if plan.transport:
            transport_cost = Decimal(str(plan.transport.price)) * plan.num_travelers
        
        estimated_spent = hotel_cost + transport_cost
        remaining = plan_budget - estimated_spent
        
        plans_data.append({
            'plan_id': plan.id,
            'destination': plan.destination.name if plan.destination else 'N/A',
            'budget': float(plan_budget),
            'estimated_spent': float(estimated_spent),
            'remaining': float(remaining),
            'hotel_cost': float(hotel_cost),
            'transport_cost': float(transport_cost)
        })
        
        total_budget += plan_budget
        total_spent += estimated_spent
    
    return Response({
        'total_budget': float(total_budget),
        'total_estimated_spent': float(total_spent),
        'total_remaining': float(total_budget - total_spent),
        'plans': plans_data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_breakdown(request, plan_id):
    """
    Get detailed budget breakdown for a specific travel plan
    """
    try:
        plan = TravelPlan.objects.get(id=plan_id, user=request.user)
    except TravelPlan.DoesNotExist:
        return Response(
            {'error': 'Travel plan not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    nights = (plan.return_date - plan.travel_date).days
    
    breakdown = {
        'plan_id': plan.id,
        'destination': plan.destination.name if plan.destination else 'N/A',
        'total_budget': float(plan.budget) if plan.budget else 0.0,
        'travelers': plan.num_travelers,
        'nights': nights,
        'costs': {
            'hotel': {
                'name': plan.hotel.name if plan.hotel else 'N/A',
                'price_per_night': float(plan.hotel.price_per_night) if plan.hotel else 0.0,
                'nights': nights,
                'travelers': plan.num_travelers,
                'total': float(Decimal(str(plan.hotel.price_per_night)) * nights * plan.num_travelers) if plan.hotel else 0.0
            },
            'transport': {
                'name': plan.transport.name if plan.transport else 'N/A',
                'price_per_person': float(plan.transport.price) if plan.transport else 0.0,
                'travelers': plan.num_travelers,
                'total': float(Decimal(str(plan.transport.price)) * plan.num_travelers) if plan.transport else 0.0
            }
        }
    }
    
    total_spent = breakdown['costs']['hotel']['total'] + breakdown['costs']['transport']['total']
    breakdown['total_estimated_spent'] = total_spent
    breakdown['remaining_budget'] = breakdown['total_budget'] - total_spent
    
    return Response(breakdown)


# ==================== DASHBOARD VIEWS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get dashboard statistics for the current user
    Shows overview of travel plans, preferences, and recommendations
    """
    user = request.user
    
    # User stats
    travel_plans = TravelPlan.objects.filter(user=user)
    total_plans = travel_plans.count()
    
    # Upcoming and past trips
    today = datetime.now().date()
    upcoming_trips = travel_plans.filter(travel_date__gte=today).count()
    past_trips = travel_plans.filter(return_date__lt=today).count()
    
    # Budget statistics
    total_budget = travel_plans.aggregate(total=Sum('budget'))['total'] or 0
    
    # Preferences
    try:
        preferences = UserPreference.objects.get(user=user)
        has_preferences = True
        preferred_budget = preferences.budget
        preferred_interest = preferences.interest
    except UserPreference.DoesNotExist:
        has_preferences = False
        preferred_budget = None
        preferred_interest = None
    
    # Recent destinations visited
    recent_destinations = travel_plans.filter(
        return_date__lt=today
    ).order_by('-return_date')[:5].values_list('destination__name', flat=True)
    
    # Recommendations available
    if has_preferences:
        recommended_destinations = RecommendationEngine.recommend_destinations(
            preferred_budget, preferred_interest
        ).count()
    else:
        recommended_destinations = 0
    
    return Response({
        'user': {
            'username': user.username,
            'email': user.email,
            'member_since': user.date_joined
        },
        'statistics': {
            'total_plans': total_plans,
            'upcoming_trips': upcoming_trips,
            'past_trips': past_trips,
            'total_budget_planned': float(total_budget)
        },
        'preferences': {
            'has_preferences': has_preferences,
            'budget': preferred_budget,
            'interest': preferred_interest
        },
        'recent_destinations': list(recent_destinations),
        'recommendations_available': recommended_destinations
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_trips(request):
    """Get user's upcoming trips"""
    today = datetime.now().date()
    plans = TravelPlan.objects.filter(
        user=request.user,
        travel_date__gte=today
    ).order_by('travel_date')
    
    serializer = TravelPlanSerializer(plans, many=True)
    return Response({
        'count': plans.count(),
        'trips': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def past_trips(request):
    """Get user's past trips"""
    today = datetime.now().date()
    plans = TravelPlan.objects.filter(
        user=request.user,
        return_date__lt=today
    ).order_by('-return_date')
    
    serializer = TravelPlanSerializer(plans, many=True)
    return Response({
        'count': plans.count(),
        'trips': serializer.data
    })


# ==================== ADMIN MANAGEMENT VIEWS ====================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard(request):
    """
    Admin dashboard with system-wide statistics
    """
    # User statistics
    total_users = User.objects.count()
    users_with_preferences = UserPreference.objects.count()
    users_with_plans = TravelPlan.objects.values('user').distinct().count()
    
    # Travel plan statistics
    total_plans = TravelPlan.objects.count()
    total_itineraries = Itinerary.objects.count()
    
    # Content statistics
    total_destinations = Destination.objects.count()
    total_hotels = Hotel.objects.count()
    total_transport = Transport.objects.count()
    
    # Budget statistics
    total_budget_value = TravelPlan.objects.aggregate(total=Sum('budget'))['total'] or 0
    avg_budget = TravelPlan.objects.aggregate(avg=Avg('budget'))['avg'] or 0
    
    # Popular destinations
    popular_destinations = TravelPlan.objects.values(
        'destination__name'
    ).annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    # Recent activity
    recent_plans = TravelPlan.objects.order_by('-created_at')[:10].values(
        'id', 'user__username', 'destination__name', 'travel_date', 'created_at'
    )
    
    return Response({
        'users': {
            'total': total_users,
            'with_preferences': users_with_preferences,
            'with_plans': users_with_plans
        },
        'travel_plans': {
            'total': total_plans,
            'total_itineraries': total_itineraries
        },
        'content': {
            'destinations': total_destinations,
            'hotels': total_hotels,
            'transport_options': total_transport
        },
        'budget': {
            'total_value': float(total_budget_value),
            'average': float(avg_budget)
        },
        'popular_destinations': list(popular_destinations),
        'recent_activity': list(recent_plans)
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users_list(request):
    """
    List all users with their statistics
    """
    users = User.objects.all()
    users_data = []
    
    for user in users:
        plans_count = TravelPlan.objects.filter(user=user).count()
        has_preferences = UserPreference.objects.filter(user=user).exists()
        
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
            'travel_plans_count': plans_count,
            'has_preferences': has_preferences
        })
    
    return Response({
        'count': len(users_data),
        'users': users_data
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_user_details(request, user_id):
    """
    Get detailed information about a specific user
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get user's preferences
    try:
        preferences = UserPreference.objects.get(user=user)
        preferences_data = UserPreferenceSerializer(preferences).data
    except UserPreference.DoesNotExist:
        preferences_data = None
    
    # Get user's travel plans
    plans = TravelPlan.objects.filter(user=user)
    plans_data = TravelPlanSerializer(plans, many=True).data
    
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_active': user.is_active,
            'date_joined': user.date_joined
        },
        'preferences': preferences_data,
        'travel_plans': {
            'count': plans.count(),
            'plans': plans_data
        }
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_travel_plans(request):
    """
    Get all travel plans across all users
    """
    plans = TravelPlan.objects.select_related(
        'user', 'destination', 'hotel', 'transport'
    ).all().order_by('-created_at')
    
    plans_data = []
    for plan in plans:
        plans_data.append({
            'id': plan.id,
            'user': plan.user.username,
            'destination': plan.destination.name if plan.destination else None,
            'hotel': plan.hotel.name if plan.hotel else None,
            'transport': plan.transport.name if plan.transport else None,
            'travel_date': plan.travel_date,
            'return_date': plan.return_date,
            'budget': float(plan.budget) if plan.budget else 0,
            'num_travelers': plan.num_travelers,
            'created_at': plan.created_at
        })
    
    return Response({
        'count': len(plans_data),
        'plans': plans_data
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_preferences_tracking(request):
    """
    Track and analyze user preferences across the system
    """
    preferences = UserPreference.objects.all()
    
    # Budget distribution
    budget_distribution = preferences.values('budget').annotate(
        count=Count('id')
    ).order_by('budget')
    
    # Interest distribution
    interest_distribution = preferences.values('interest').annotate(
        count=Count('id')
    ).order_by('interest')
    
    # Country preferences
    country_preferences = preferences.values('preferred_country').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Traveler size distribution
    travelers_distribution = preferences.values('num_travelers').annotate(
        count=Count('id')
    ).order_by('num_travelers')
    
    return Response({
        'total_preferences': preferences.count(),
        'budget_distribution': list(budget_distribution),
        'interest_distribution': list(interest_distribution),
        'country_preferences': list(country_preferences),
        'travelers_distribution': list(travelers_distribution)
    })


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_toggle_user_status(request, user_id):
    """
    Activate or deactivate a user account
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user.is_active = not user.is_active
    user.save()
    
    return Response({
        'message': f'User {user.username} is now {"active" if user.is_active else "inactive"}',
        'is_active': user.is_active
    })

# ==================== ADMIN MANAGEMENT - CONTENT CRUD ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_manage_destinations(request):
    """
    List all destinations or create a new destination (admin only)
    """
    if request.method == 'GET':
        destinations = Destination.objects.all().order_by('-created_at')
        serializer = DestinationSerializer(destinations, many=True)
        return Response({
            'count': destinations.count(),
            'destinations': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = DestinationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Destination created successfully',
                'destination': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_destination_detail(request, destination_id):
    """
    Get, update, or delete a specific destination (admin only)
    """
    try:
        destination = Destination.objects.get(id=destination_id)
    except Destination.DoesNotExist:
        return Response(
            {'error': 'Destination not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = DestinationSerializer(destination)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = DestinationSerializer(destination, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Destination updated successfully',
                'destination': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        name = destination.name
        destination.delete()
        return Response({'message': f'Destination "{name}" deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_manage_hotels(request):
    """
    List all hotels or create a new hotel (admin only)
    """
    if request.method == 'GET':
        hotels = Hotel.objects.all().order_by('-created_at')
        serializer = HotelSerializer(hotels, many=True)
        return Response({
            'count': hotels.count(),
            'hotels': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = HotelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Hotel created successfully',
                'hotel': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_hotel_detail(request, hotel_id):
    """
    Get, update, or delete a specific hotel (admin only)
    """
    try:
        hotel = Hotel.objects.get(id=hotel_id)
    except Hotel.DoesNotExist:
        return Response(
            {'error': 'Hotel not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = HotelSerializer(hotel)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = HotelSerializer(hotel, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Hotel updated successfully',
                'hotel': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        name = hotel.name
        hotel.delete()
        return Response({'message': f'Hotel "{name}" deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_manage_transport(request):
    """
    List all transport options or create a new one (admin only)
    """
    if request.method == 'GET':
        transports = Transport.objects.all().order_by('-created_at')
        serializer = TransportSerializer(transports, many=True)
        return Response({
            'count': transports.count(),
            'transports': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = TransportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Transport option created successfully',
                'transport': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_transport_detail(request, transport_id):
    """
    Get, update, or delete a specific transport option (admin only)
    """
    try:
        transport = Transport.objects.get(id=transport_id)
    except Transport.DoesNotExist:
        return Response(
            {'error': 'Transport not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = TransportSerializer(transport)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = TransportSerializer(transport, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Transport updated successfully',
                'transport': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        name = transport.name
        transport.delete()
        return Response({'message': f'Transport "{name}" deleted successfully'})