from django.urls import path
from .views import favorites,playlist

urlpatterns = [
    path("favorites/", favorites),
    path("playlists/",playlist)
]