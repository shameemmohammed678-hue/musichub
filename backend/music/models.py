from django.db import models
from django.contrib.auth.models import User


class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    audio = models.CharField(max_length=500)
    cover = models.CharField(max_length=500)

    def __str__(self):
        return self.title


class Favorite(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    song = models.ForeignKey(
        Song,
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "song"],
                name="unique_user_favorite"
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.song.title}"


class Playlist(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="playlists"
    )

    name = models.CharField(max_length=200, default="My Playlist")

    songs = models.ManyToManyField(
        Song,
        related_name="playlists",
        blank=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.name}"