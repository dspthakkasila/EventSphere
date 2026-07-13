from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from .models import Event
from .serializers import EventSerializer


class EventListCreateView(APIView):
    """
    GET  /api/events/  — public, returns all events ordered newest first
    POST /api/events/  — requires auth, creates a new event
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        events = Event.objects.all().order_by("-created_at")
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(organizer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventDetailView(generics.RetrieveAPIView):
    """
    GET /api/events/<pk>/ — public
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
