from django.db import models
from django.conf import settings

class Video(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    cloudflare_video_id = models.CharField(max_length=200, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='videos'
    )
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title