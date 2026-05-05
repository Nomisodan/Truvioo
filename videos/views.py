from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
import requests
from .models import Video
from .serializers import VideoSerializer

class GetUploadURLView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
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
        
        try:
            response = requests.post(url, headers=headers, json=data)
            print("STATUS:", response.status_code)
            print("BODY:", response.text)
            result = response.json()
        except Exception as e:
            print("REQUEST FAILED:", str(e))
            return Response({"error": str(e)}, status=500)
        
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

class VideoDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VideoSerializer
    queryset = Video.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)