from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    MessageSerializer,
    StartConversationSerializer,
)
from apps.accounts.models import User


class ConversationListView(APIView):
    """
    GET  /api/messages/conversations/   — list all conversations for current user
    POST /api/messages/conversations/   — start a new conversation (or return existing)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        convs = Conversation.objects.filter(
            participants=request.user
        ).prefetch_related("participants", "messages__sender")
        serializer = ConversationSerializer(convs, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        ser = StartConversationSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        recipient_id = ser.validated_data["recipient_id"]
        body = ser.validated_data["body"]

        recipient = get_object_or_404(User, id=recipient_id)

        # Reuse existing conversation if it exists between the two users
        existing = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants=recipient
        ).first()

        if existing:
            conv = existing
        else:
            conv = Conversation.objects.create()
            conv.participants.add(request.user, recipient)

        # Create the first/new message
        Message.objects.create(
            conversation=conv,
            sender=request.user,
            body=body
        )
        conv.save()  # bump updated_at

        serializer = ConversationSerializer(conv, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageListCreateView(APIView):
    """
    GET  /api/messages/conversations/<conv_id>/messages/  — load all messages
    POST /api/messages/conversations/<conv_id>/messages/  — send a message
    """
    permission_classes = [IsAuthenticated]

    def get_conversation(self, conv_id, user):
        return get_object_or_404(
            Conversation,
            id=conv_id,
            participants=user
        )

    def get(self, request, conv_id):
        conv = self.get_conversation(conv_id, request.user)

        # Mark incoming messages as read
        conv.messages.exclude(sender=request.user).update(is_read=True)

        messages = conv.messages.select_related("sender").all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, conv_id):
        conv = self.get_conversation(conv_id, request.user)

        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(sender=request.user, conversation=conv)

        # bump conversation timestamp
        conv.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UnreadCountView(APIView):
    """GET /api/messages/unread/ — total unread messages for current user"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(
            conversation__participants=request.user,
            is_read=False
        ).exclude(sender=request.user).count()
        return Response({"unread": count})
