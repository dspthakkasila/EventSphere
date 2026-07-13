from rest_framework import serializers
from .models import Event
from apps.accounts.models import User


class OrganizerSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "username"]


class EventSerializer(serializers.ModelSerializer):

    organizer_detail = OrganizerSerializer(source="organizer", read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
