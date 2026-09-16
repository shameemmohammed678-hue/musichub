from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

from .models import Song, Favorite,Playlist


@api_view(["GET", "POST"])
def favorites(request):
    user = request.user

    if not user.is_authenticated:
        return Response(
            {"error": "Authentication required."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if request.method == "GET":
        favorite_songs = Song.objects.filter(
            favorited_by__user=user
        )

        return Response([
            {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "cover": song.cover,
                "audio": song.audio,
            }
            for song in favorite_songs
        ])

    song_id = request.data.get("song_id")

    if not song_id:
        return Response(
            {"error": "song_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        song = Song.objects.get(id=song_id)
    except Song.DoesNotExist:
        return Response(
            {"error": "Song not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    favorite = Favorite.objects.filter(
        user=user,
        song=song
    ).first()

    if favorite:
        favorite.delete()

        return Response({
            "message": "Removed from favorites."
        })

    Favorite.objects.create(
        user=user,
        song=song
    )

    return Response(
        {"message": "Added to favorites."},
        status=status.HTTP_201_CREATED
    )


@api_view(["GET", "POST"])
def playlist(request):
    user = request.user

    if not user.is_authenticated:
        return Response(
            {"error": "Authentication required."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # GET user's playlist
    if request.method == "GET":
        user_playlist = Playlist.objects.filter(
            user=user
        ).first()

        if not user_playlist:
            return Response([])

        songs = user_playlist.songs.all()

        return Response([
            {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "cover": song.cover,
                "audio": song.audio,
            }
            for song in songs
        ])

    # POST - add/remove song
    song_id = request.data.get("song_id")

    if not song_id:
        return Response(
            {"error": "song_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        song = Song.objects.get(id=song_id)
    except Song.DoesNotExist:
        return Response(
            {"error": "Song not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    user_playlist, created = Playlist.objects.get_or_create(
        user=user,
        name="My Playlist"
    )

    if user_playlist.songs.filter(id=song.id).exists():
        user_playlist.songs.remove(song)

        return Response({
            "message": "Removed from playlist."
        })

    user_playlist.songs.add(song)

    return Response(
        {"message": "Added to playlist."},
        status=status.HTTP_201_CREATED
    )