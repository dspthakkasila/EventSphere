from rest_framework import serializers
from .models import Booking
from apps.events.serializers import EventSerializer


class BookingSerializer(serializers.ModelSerializer):

    event_detail = EventSerializer(source="event", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "user", "event", "event_detail",
            "quantity", "total_price", "status", "booked_at"
        ]
        read_only_fields = ["user", "total_price", "booked_at"]

    def validate(self, attrs):
        event = attrs.get("event")
        quantity = attrs.get("quantity", 1)

        if event.available_seats < quantity:
            raise serializers.ValidationError(
                f"Only {event.available_seats} seat(s) available."
            )

        return attrs

    def create(self, validated_data):
        event = validated_data["event"]
        quantity = validated_data.get("quantity", 1)

        # Calculate total price
        validated_data["total_price"] = event.price * quantity

        # Reduce available seats
        event.available_seats -= quantity
        event.save()

        return super().create(validated_data)
