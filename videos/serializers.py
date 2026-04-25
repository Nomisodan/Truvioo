from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(
        source='creator.display_name',
        read_only=True
    )

    class Meta:
        model = Video
        fields = [
            'id',
            'title',
            'description',
            'cloudflare_video_id',
            'thumbnail',
            'creator',
            'creator_name',
            'view_count',
            'created_at',
        ]
        read_only_fields = ['creator', 'view_count', 'created_at']