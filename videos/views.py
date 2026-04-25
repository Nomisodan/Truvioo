from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
import requests
from .models import Video
from .serializers import VideoSerializer

class GetUploadURLView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print("CLOUDFLARE_ACCOUNT_ID:", settings.CLOUDFLARE_ACCOUNT_ID)
        print("CLOUDFLARE_API_TOKEN:", settings.CLOUDFLARE_API_TOKEN)
        
        url = f"https://api.cloudflare.com/client/v4/accounts/{settings.CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload"
        
        headers = {
            "Authorization": f"Bearer {settings.CLOUDFLARE_API_TOKEN}",
            "Content-Type": "application/json"
        }
        
        data = {
            "maxDurationSeconds": 3600
        }
        
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        
        if response.status_code == 200:
            return Response({
                "upload_url": result["result"]["uploadURL"],
                "video_id": result["result"]["uid"]
            })
        
        return Response(
            {"error": "Failed to get upload URL"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class VideoCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VideoSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class VideoListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VideoSerializer
    queryset = Video.objects.all().order_by('-created_at')