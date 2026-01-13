# Generated migrations file

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Destination',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('country', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('image_url', models.URLField(blank=True, null=True)),
                ('category', models.CharField(choices=[('beach', 'Beach'), ('wildlife', 'Wildlife'), ('historical', 'Historical'), ('city_tour', 'City Tour'), ('adventure', 'Adventure'), ('culture', 'Culture')], max_length=50)),
                ('best_season', models.CharField(max_length=100)),
                ('avg_temperature', models.CharField(max_length=50)),
                ('budget_level', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Transport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('origin', models.CharField(max_length=100)),
                ('destination', models.CharField(max_length=100)),
                ('transport_type', models.CharField(choices=[('bus', 'Bus'), ('train', 'Train'), ('flight', 'Flight'), ('car', 'Car')], max_length=20)),
                ('distance_km', models.IntegerField()),
                ('estimated_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('duration_hours', models.FloatField()),
                ('availability', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserPreference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('budget', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium', max_length=10)),
                ('interest', models.CharField(choices=[('beach', 'Beach'), ('wildlife', 'Wildlife'), ('historical', 'Historical'), ('city_tour', 'City Tour'), ('adventure', 'Adventure'), ('culture', 'Culture')], default='beach', max_length=20)),
                ('num_travelers', models.IntegerField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='preference', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Hotel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('stars', models.IntegerField(choices=[(1, '1 Star'), (2, '2 Stars'), (3, '3 Stars'), (4, '4 Stars'), (5, '5 Stars')])),
                ('price_per_night', models.DecimalField(decimal_places=2, max_digits=10)),
                ('budget_category', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], max_length=10)),
                ('description', models.TextField()),
                ('image_url', models.URLField(blank=True, null=True)),
                ('amenities', models.TextField(help_text='Comma-separated amenities')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hotels', to='api.destination')),
            ],
        ),
        migrations.CreateModel(
            name='TravelPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('travel_date', models.DateField()),
                ('return_date', models.DateField()),
                ('budget', models.DecimalField(decimal_places=2, max_digits=15)),
                ('num_travelers', models.IntegerField()),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('destination', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.destination')),
                ('hotel', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.hotel')),
                ('transport', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.transport')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='travel_plans', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Itinerary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day_number', models.IntegerField()),
                ('activities', models.TextField()),
                ('accommodation', models.CharField(blank=True, max_length=200)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('travel_plan', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='itinerary', to='api.travelplan')),
            ],
        ),
    ]
