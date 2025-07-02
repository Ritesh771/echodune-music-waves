from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, UserProfileView, GoogleLoginView, SongListAPIView,
    PlaylistListCreateView, PlaylistDetailView, LikedSongListCreateView, LikedSongDeleteView, LikedSongCreateView,
    QueueView, DownloadListCreateView, DownloadDeleteView,
    PlaylistCollaboratorAddView, PlaylistCollaboratorRemoveView, PlaylistLikeView,
    PlaylistShareView, PlaylistJoinSharedView, RecentSearchListCreateView, RecommendationView, SearchView, PlaybackControlView,
    liked_song_ids
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('songs/', SongListAPIView.as_view(), name='song-list'),
    path('playlists/', PlaylistListCreateView.as_view(), name='playlist-list-create'),
    path('playlists/<int:pk>/', PlaylistDetailView.as_view(), name='playlist-detail'),
    path('liked-songs/', LikedSongListCreateView.as_view(), name='liked-song-list-create'),
    path('liked-songs/<int:song_id>/', LikedSongCreateView.as_view(), name='liked-song-create'),
    path('liked-songs/<int:song_id>/delete/', LikedSongDeleteView.as_view(), name='liked-song-delete'),
    path('liked-songs/ids/', liked_song_ids, name='liked-song-ids'),

    # Queue
    path('queue/', QueueView.as_view(), name='queue'),

    # Downloads
    path('downloads/', DownloadListCreateView.as_view(), name='download-list-create'),
    path('downloads/<int:song_id>/', DownloadDeleteView.as_view(), name='download-delete'),

    # Playlist Collaboration
    path('playlists/<int:pk>/add-collaborator/', PlaylistCollaboratorAddView.as_view(), name='playlist-add-collaborator'),
    path('playlists/<int:pk>/remove-collaborator/', PlaylistCollaboratorRemoveView.as_view(), name='playlist-remove-collaborator'),

    # Playlist Like/Unlike
    path('playlists/<int:pk>/like/', PlaylistLikeView.as_view(), name='playlist-like'),

    # Playlist Sharing
    path('playlists/<int:pk>/share/', PlaylistShareView.as_view(), name='playlist-share'),
    path('playlists/join-shared/', PlaylistJoinSharedView.as_view(), name='playlist-join-shared'),

    # Recent Search
    path('recent-search/', RecentSearchListCreateView.as_view(), name='recent-search-list-create'),

    # Recommendations
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),

    # Search
    path('search/', SearchView.as_view(), name='search'),

    # Playback Controls
    path('playback/', PlaybackControlView.as_view(), name='playback-control'),
]