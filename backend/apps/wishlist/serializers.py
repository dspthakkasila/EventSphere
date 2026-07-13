from rest_framework import serializers
from .models import Wishlist
from apps.events.serializers import EventSerializer


class WishlistSerializer(serializers.ModelSerializer):

    event_detail = EventSerializer(source="event", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "user", "event", "event_detail", "created_at"]
        # user is always set from request.user in the view — never from request body
        read_only_fields = ["user", "created_at"]
