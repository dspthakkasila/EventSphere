from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ["user", "event", "quantity", "total_price", "status", "booked_at"]
    list_filter = ["status", "booked_at"]
    search_fields = ["user__email", "event__title"]
    ordering = ["-booked_at"]
    list_editable = ["status"]
