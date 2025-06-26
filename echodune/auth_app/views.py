from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.utils import psa
from .models import CustomUser, Song, Playlist, LikedSong, PlaylistCollaborator, PlaylistLike, Queue, QueueSong, Download, RecentSearch
from .serializers import SongSerializer, PlaylistSerializer, LikedSongSerializer, PlaylistCollaboratorSerializer, PlaylistLikeSerializer, QueueSerializer, QueueSongSerializer, DownloadSerializer, RecentSearchSerializer
from rest_framework import generics, permissions, filters
from rest_framework.pagination import PageNumberPagination
import json
import requests
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework import viewsets

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if not username or not email or not password:
                return JsonResponse({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            return JsonResponse({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'profile_picture': user.profile_picture or ''
            }, status=status.HTTP_201_CREATED)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        return JsonResponse({'error': 'Not implemented, use /api/token/'}, status=status.HTTP_501_NOT_IMPLEMENTED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'profile_picture': user.profile_picture or ''
        })

class GoogleLoginView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'error': 'Access token required'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify token with Google
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        if google_response.status_code != 200:
            return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)

        user_info = google_response.json()
        email = user_info.get('email')
        name = user_info.get('name')
        picture = user_info.get('picture')

        if not email:
            return Response({'error': 'No email found in Google account'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            'username': email.split('@')[0],
            'profile_picture': picture,
        })

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class SongPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50

class SongListAPIView(generics.ListAPIView):
    queryset = Song.objects.all().order_by('-uploaded_at')
    serializer_class = SongSerializer
    permission_classes = []
    pagination_class = SongPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'artist', 'album']

class PlaylistListCreateView(generics.ListCreateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PlaylistDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user)

class LikedSongListCreateView(generics.ListCreateAPIView):
    serializer_class = LikedSongSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LikedSong.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        song_id = self.request.data.get('song_id')
        song = Song.objects.get(id=song_id)
        serializer.save(user=self.request.user, song=song)

class LikedSongDeleteView(generics.DestroyAPIView):
    serializer_class = LikedSongSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        song_id = self.kwargs['song_id']
        return LikedSong.objects.get(user=self.request.user, song__id=song_id)

# --- Queue Management ---
class QueueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queue, _ = Queue.objects.get_or_create(user=request.user)
        serializer = QueueSerializer(queue)
        return Response(serializer.data)

    def post(self, request):
        queue, _ = Queue.objects.get_or_create(user=request.user)
        song_id = request.data.get('song_id')
        order = request.data.get('order')
        if not song_id:
            return Response({'error': 'song_id required'}, status=400)
        song = Song.objects.get(id=song_id)
        if order is None:
            order = QueueSong.objects.filter(queue=queue).count()
        QueueSong.objects.create(queue=queue, song=song, order=order)
        return Response({'message': 'Song added to queue'})

    def delete(self, request):
        queue, _ = Queue.objects.get_or_create(user=request.user)
        song_id = request.data.get('song_id')
        if not song_id:
            return Response({'error': 'song_id required'}, status=400)
        QueueSong.objects.filter(queue=queue, song__id=song_id).delete()
        return Response({'message': 'Song removed from queue'})

# --- Download Management ---
class DownloadListCreateView(generics.ListCreateAPIView):
    serializer_class = DownloadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Download.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        song_id = self.request.data.get('song_id')
        song = Song.objects.get(id=song_id)
        serializer.save(user=self.request.user, song=song)

class DownloadDeleteView(generics.DestroyAPIView):
    serializer_class = DownloadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        song_id = self.kwargs['song_id']
        return Download.objects.get(user=self.request.user, song__id=song_id)

# --- Playlist Collaboration ---
class PlaylistCollaboratorAddView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        playlist = Playlist.objects.get(pk=pk)
        if playlist.user != request.user:
            return Response({'error': 'Only owner can add collaborators'}, status=403)
        user_id = request.data.get('user_id')
        user = CustomUser.objects.get(id=user_id)
        PlaylistCollaborator.objects.get_or_create(playlist=playlist, user=user)
        return Response({'message': 'Collaborator added'})

class PlaylistCollaboratorRemoveView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        playlist = Playlist.objects.get(pk=pk)
        if playlist.user != request.user:
            return Response({'error': 'Only owner can remove collaborators'}, status=403)
        user_id = request.data.get('user_id')
        user = CustomUser.objects.get(id=user_id)
        PlaylistCollaborator.objects.filter(playlist=playlist, user=user).delete()
        return Response({'message': 'Collaborator removed'})

# --- Playlist Like/Unlike ---
class PlaylistLikeView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        playlist = Playlist.objects.get(pk=pk)
        PlaylistLike.objects.get_or_create(playlist=playlist, user=request.user)
        return Response({'message': 'Playlist liked'})
    def delete(self, request, pk):
        playlist = Playlist.objects.get(pk=pk)
        PlaylistLike.objects.filter(playlist=playlist, user=request.user).delete()
        return Response({'message': 'Playlist unliked'})

# --- Playlist Sharing (Link/QR) ---
import uuid
class PlaylistShareView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        playlist = Playlist.objects.get(pk=pk)
        if playlist.user != request.user:
            return Response({'error': 'Only owner can share playlist'}, status=403)
        if not playlist.share_link:
            playlist.share_link = str(uuid.uuid4())
            playlist.is_shared = True
            playlist.save()
        return Response({'share_link': playlist.share_link})

class PlaylistJoinSharedView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        share_link = request.data.get('share_link')
        playlist = Playlist.objects.get(share_link=share_link)
        PlaylistCollaborator.objects.get_or_create(playlist=playlist, user=request.user)
        return Response({'message': 'Joined shared playlist'})

# --- Recent Search History ---
class RecentSearchListCreateView(generics.ListCreateAPIView):
    serializer_class = RecentSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return RecentSearch.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- Recommendations (basic) ---
class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Recommend based on liked songs, recently played, and playlist content
        liked_song_ids = LikedSong.objects.filter(user=request.user).values_list('song_id', flat=True)
        playlist_song_ids = Playlist.objects.filter(user=request.user).values_list('songs', flat=True)
        # Combine and get unique song ids
        song_ids = set(list(liked_song_ids) + list(playlist_song_ids))
        # Recommend songs not already liked or in playlists
        recommendations = Song.objects.exclude(id__in=song_ids).order_by('?')[:10]
        serializer = SongSerializer(recommendations, many=True)
        return Response(serializer.data)

# --- Search ---
class SearchView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({'results': []})
        # Save to recent search
        RecentSearch.objects.create(user=request.user, query=query)
        songs = Song.objects.filter(Q(title__icontains=query) | Q(artist__icontains=query) | Q(album__icontains=query))
        playlists = Playlist.objects.filter(Q(name__icontains=query))
        song_results = SongSerializer(songs, many=True).data
        playlist_results = PlaylistSerializer(playlists, many=True).data
        return Response({'songs': song_results, 'playlists': playlist_results})

# --- Playback Controls (dummy endpoints, logic handled on frontend) ---
class PlaybackControlView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        action = request.data.get('action')
        # Actions: play, pause, next, previous, seek, shuffle, loop
        # This is a placeholder; actual playback is handled on frontend/mobile
        return Response({'message': f'Playback action: {action}'})
