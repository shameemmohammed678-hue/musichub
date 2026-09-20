from django.urls import path
from .views import favorites,playlist,songs,upload_song

urlpatterns = [
    path("favorites/", favorites),
    path("playlists/",playlist),
    path("songs/",songs),
    path("songs/upload/",upload_song)
]