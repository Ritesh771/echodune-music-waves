from rest_framework import serializers
from .models import Song, Playlist, LikedSong, PlaylistCollaborator, PlaylistLike, Queue, QueueSong, Download, RecentSearch

class SongSerializer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=True)
    cover_image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Song
        fields = '__all__'

class PlaylistCollaboratorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = PlaylistCollaborator
        fields = ['id', 'user', 'added_at']

class PlaylistLikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = PlaylistLike
        fields = ['id', 'user', 'created_at']

class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    songs = SongSerializer(many=True, read_only=True)
    cover_image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    collaborators = PlaylistCollaboratorSerializer(many=True, read_only=True)
    likes = PlaylistLikeSerializer(many=True, read_only=True)
    share_link = serializers.CharField(read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user', 'songs', 'cover_image', 'created_at', 'is_shared', 'share_link', 'collaborators', 'likes']

class LikedSongSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    song = SongSerializer(read_only=True)

    class Meta:
        model = LikedSong
        fields = ['id', 'user', 'song', 'created_at']

class QueueSongSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    class Meta:
        model = QueueSong
        fields = ['id', 'song', 'order']

class QueueSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    songs = QueueSongSerializer(source='queuesong_set', many=True, read_only=True)
    class Meta:
        model = Queue
        fields = ['id', 'user', 'songs']

class DownloadSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    song = SongSerializer(read_only=True)
    class Meta:
        model = Download
        fields = ['id', 'user', 'song', 'downloaded_at']

class RecentSearchSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = RecentSearch
        fields = ['id', 'user', 'query', 'searched_at'] 