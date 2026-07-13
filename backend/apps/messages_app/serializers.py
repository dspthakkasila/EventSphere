from rest_framework import serializers
from .models import Conversation, Message
from apps.accounts.models import User


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "role"]


class MessageSerializer(serializers.ModelSerializer):
    sender = ParticipantSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "body", "is_read", "created_at"]
        read_only_fields = ["sender", "is_read", "created_at"]


class ConversationSerializer(serializers.ModelSerializer):
    participants = ParticipantSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "participants", "last_message", "unread_count", "created_at", "updated_at"]

    def get_last_message(self, obj):
        msg = obj.messages.last()
        if msg:
            return {"body": msg.body, "sender_email": msg.sender.email, "created_at": str(msg.created_at)}
        return None

    def get_unread_count(self, obj):
        request = self.context.get("request")
        if request:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0


class StartConversationSerializer(serializers.Serializer):
    """Used to start a new conversation with another user by their ID."""
    recipient_id = serializers.IntegerField()
    body = serializers.CharField()
