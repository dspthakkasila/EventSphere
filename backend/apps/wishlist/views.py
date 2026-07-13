from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/wishlist/  — returns only the logged-in user's wishlist items
    POST /api/wishlist/  — adds an event to the logged-in user's wishlist
    """

    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related(
            "event"
        )

    def perform_create(self, serializer):
        # Prevent duplicate entries
        event = serializer.validated_data.get("event")
        if Wishlist.objects.filter(user=self.request.user, event=event).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Event already in wishlist.")
        serializer.save(user=self.request.user)


class WishlistDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/wishlist/<pk>/ — removes item only if it belongs to the logged-in user
    """

    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
