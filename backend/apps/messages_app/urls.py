from django.urls import path
from .views import ConversationListView, MessageListCreateView, UnreadCountView

urlpatterns = [
    path(
        "conversations/",
        ConversationListView.as_view(),
        name="conversations"
    ),
    path(
        "conversations/<int:conv_id>/messages/",
        MessageListCreateView.as_view(),
        name="messages"
    ),
    path(
        "unread/",
        UnreadCountView.as_view(),
        name="unread-count"
    ),
]
