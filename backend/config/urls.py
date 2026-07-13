from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path("admin/", admin.site.urls),

    path(
        "api/accounts/",
        include("apps.accounts.urls")
    ),

    path(
        "api/events/",
        include("apps.events.urls")
    ),

    path(
        "api/wishlist/",
        include("apps.wishlist.urls")
    ),

    path(
        "api/bookings/",
        include("apps.bookings.urls")
    ),

    path(
        "api/messages/",
        include("apps.messages_app.urls")
    ),

]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )