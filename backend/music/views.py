from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
import cloudinary.uploader
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




@api_view(["GET"])
def songs(request):
    all_songs = Song.objects.all().order_by("id")

    return Response([
        {
            "id": song.id,
            "title": song.title,
            "artist": song.artist,
            "cover": song.cover,
            "audio": song.audio,
        }
        for song in all_songs
    ])



@api_view(["POST"])
def upload_song(request):
    # Authentication check
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Admin/staff check
    if not request.user.is_staff:
        return Response(
            {"error": "Admin access required."},
            status=status.HTTP_403_FORBIDDEN
        )

    title = request.data.get("title")
    artist = request.data.get("artist")
    audio_file = request.FILES.get("audio")
    cover_file = request.FILES.get("cover")

    if not title or not artist or not audio_file or not cover_file:
        return Response(
            {"error": "Title, artist, audio and cover are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Upload audio
        audio_result = cloudinary.uploader.upload(
            audio_file,
            resource_type="video",
            folder="musichub/songs/audio"
        )

        # Upload cover
        cover_result = cloudinary.uploader.upload(
            cover_file,
            resource_type="image",
            folder="musichub/songs/covers"
        )

        # Save song information in TiDB
        song = Song.objects.create(
            title=title,
            artist=artist,
            audio=audio_result["secure_url"],
            cover=cover_result["secure_url"]
        )

        return Response(
            {
                "message": "Song uploaded successfully.",
                "song": {
                    "id": song.id,
                    "title": song.title,
                    "artist": song.artist,
                    "audio": song.audio,
                    "cover": song.cover,
                }
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as error:
        return Response(
            {"error": str(error)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )