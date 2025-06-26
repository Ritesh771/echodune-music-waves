from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.utils import psa
from .models import CustomUser, Song, Playlist, LikedSong
from .serializers import SongSerializer, PlaylistSerializer, LikedSongSerializer
from rest_framework import generics, permissions, filters
from rest_framework.pagination import PageNumberPagination
import json
import requests
from django.contrib.auth import get_user_model
from rest_framework.response import Response

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
