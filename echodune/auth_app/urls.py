from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, UserProfileView, GoogleLoginView, SongListAPIView,
    PlaylistListCreateView, PlaylistDetailView, LikedSongListCreateView, LikedSongDeleteView
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
    path('liked-songs/<int:song_id>/', LikedSongDeleteView.as_view(), name='liked-song-delete'),
]