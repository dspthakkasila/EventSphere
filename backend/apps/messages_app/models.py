from django.db import models
from apps.accounts.models import User


class Conversation(models.Model):
    """
    A thread between two users (e.g. attendee ↔ organizer, or user ↔ support).
    """
    participants = models.ManyToManyField(
        User,
        related_name="conversations"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        names = ", ".join(p.email for p in self.participants.all())
        return f"Conversation({names})"


class Message(models.Model):
    """
    A single message inside a Conversation.
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.email}: {self.body[:50]}"
