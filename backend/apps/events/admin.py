from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        "title", "category", "organizer", "event_date",
        "status", "is_featured", "available_seats", "price", "created_at"
    ]
    list_filter = ["status", "category", "is_featured"]
    search_fields = ["title", "location", "organizer__email"]
    ordering = ["-created_at"]
    date_hierarchy = "event_date"
    list_editable = ["status", "is_featured"]
