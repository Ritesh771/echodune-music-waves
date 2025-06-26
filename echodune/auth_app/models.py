from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture = models.URLField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255, blank=True, null=True)
    file = models.FileField(upload_to='songs/')
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    duration = models.FloatField(blank=True, null=True, help_text='Duration in seconds')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"

class Playlist(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='playlists')
    songs = models.ManyToManyField(Song, related_name='playlists', blank=True)
    cover_image = models.ImageField(upload_to='playlist_covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_shared = models.BooleanField(default=False)
    share_link = models.CharField(max_length=255, blank=True, null=True, unique=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class PlaylistCollaborator(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='collaborators')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='collaborations')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('playlist', 'user')

    def __str__(self):
        return f"{self.user.username} collaborates on {self.playlist.name}"

class PlaylistLike(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='liked_playlists')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('playlist', 'user')

    def __str__(self):
        return f"{self.user.username} likes {self.playlist.name}"

class LikedSong(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='liked_songs')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='liked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'song')

    def __str__(self):
        return f"{self.user.username} likes {self.song.title}"

class Queue(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='queue')
    songs = models.ManyToManyField(Song, through='QueueSong', related_name='in_queues')

    def __str__(self):
        return f"Queue for {self.user.username}"

class QueueSong(models.Model):
    queue = models.ForeignKey(Queue, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('queue', 'song')
        ordering = ['order']

    def __str__(self):
        return f"{self.song.title} in {self.queue.user.username}'s queue at {self.order}"

class Download(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='downloads')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='downloaded_by')
    downloaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'song')

    def __str__(self):
        return f"{self.user.username} downloaded {self.song.title}"

class RecentSearch(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recent_searches')
    query = models.CharField(max_length=255)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-searched_at']

    def __str__(self):
        return f"{self.user.username} searched '{self.query}'"