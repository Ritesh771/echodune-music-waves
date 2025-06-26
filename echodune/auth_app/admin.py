from django.contrib import admin
from .models import CustomUser, Song, Playlist, LikedSong
from django.utils.html import format_html

class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'uploaded_at', 'cover_thumb')
    search_fields = ('title', 'artist', 'album')
    list_filter = ('artist', 'album', 'uploaded_at')

    def cover_thumb(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit:cover;" />', obj.cover_image.url)
        return "-"
    cover_thumb.short_description = 'Cover'

class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'song_count', 'created_at')
    search_fields = ('name', 'user__username')
    list_filter = ('user', 'created_at')

    def song_count(self, obj):
        return obj.songs.count()
    song_count.short_description = 'Songs'

class LikedSongAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'created_at')
    search_fields = ('user__username', 'song__title')
    list_filter = ('user', 'created_at')

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Song, SongAdmin)
admin.site.register(Playlist, PlaylistAdmin)
admin.site.register(LikedSong, LikedSongAdmin)





