from rest_framework import serializers
from .models import Song, Playlist, LikedSong

class SongSerializer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=True)
    cover_image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Song
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    songs = SongSerializer(many=True, read_only=True)
    cover_image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user', 'songs', 'cover_image', 'created_at']

class LikedSongSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    song = SongSerializer(read_only=True)

    class Meta:
        model = LikedSong
        fields = ['id', 'user', 'song', 'created_at'] 