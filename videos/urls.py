from django.urls import path
from .views import GetUploadURLView, VideoCreateView, VideoListView

urlpatterns = [
    path('upload-url/', GetUploadURLView.as_view(), name='get-upload-url'),
    path('create/', VideoCreateView.as_view(), name='video-create'),
    path('', VideoListView.as_view(), name='video-list'),
]