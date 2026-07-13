from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from .email_utils import send_booking_confirmation


class BookingListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/bookings/  — logged-in user's bookings
    POST /api/bookings/  — book tickets for an event
    """

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        ).select_related("event").order_by("-booked_at")

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        # Send confirmation email with QR code (non-blocking — fails silently)
        send_booking_confirmation(booking)


class BookingDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    /api/bookings/<pk>/  — booking detail
    DELETE /api/bookings/<pk>/  — cancel booking (soft delete, restores seats)
    """

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.status == "cancelled":
            return  # already cancelled, nothing to do

        # Restore seats
        event = instance.event
        event.available_seats += instance.quantity
        event.save()

        instance.status = "cancelled"
        instance.save()
