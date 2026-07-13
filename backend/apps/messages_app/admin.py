from django.contrib import admin
from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ["id", "get_participants", "created_at", "updated_at"]
    search_fields = ["participants__email"]

    def get_participants(self, obj):
        return ", ".join(p.email for p in obj.participants.all())
    get_participants.short_description = "Participants"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["sender", "conversation", "body", "is_read", "created_at"]
    list_filter = ["is_read"]
    search_fields = ["sender__email", "body"]
    ordering = ["-created_at"]
