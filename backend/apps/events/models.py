from django.db import models
from apps.accounts.models import User


class Event(models.Model):

    EVENT_STATUS = (
        ("Upcoming", "Upcoming"),
        ("Live", "Live"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    )

    CATEGORY_CHOICES = (
        ("Technology", "Technology"),
        ("Business", "Business"),
        ("Workshop", "Workshop"),
        ("Music", "Music"),
        ("Sports", "Sports"),
        ("Education", "Education"),
        ("AI", "AI"),
        ("Startup", "Startup"),
        ("Health", "Health"),
        ("Gaming", "Gaming"),
        ("Food", "Food"),
        ("Design", "Design"),
        ("Networking", "Networking"),
        ("Finance", "Finance"),
    )

    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="events"
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES
    )

    banner = models.ImageField(
        upload_to="event_banners/",
        blank=True,
        null=True
    )

    banner_url = models.URLField(
        blank=True,
        null=True
    )

    promo_video = models.FileField(
        upload_to="event_videos/",
        blank=True,
        null=True
    )

    promo_video_url = models.URLField(
        blank=True,
        null=True
    )

    location = models.CharField(max_length=250)

    google_map_link = models.URLField(
        blank=True,
        null=True
    )

    event_date = models.DateField()

    event_time = models.TimeField()

    total_seats = models.PositiveIntegerField()

    available_seats = models.PositiveIntegerField()

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=5.0
    )

    status = models.CharField(
        max_length=20,
        choices=EVENT_STATUS,
        default="Upcoming"
    )

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):

        return self.title