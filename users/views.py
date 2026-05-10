from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Subscription
from .serializers import RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class SubscribeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, creator_id):
        creator = get_object_or_404(User, id=creator_id)
        if creator == request.user:
            return Response({'error': 'Cannot subscribe to yourself.'}, status=400)
        Subscription.objects.get_or_create(subscriber=request.user, creator=creator)
        return Response({'subscribed': True})

    def delete(self, request, creator_id):
        creator = get_object_or_404(User, id=creator_id)
        Subscription.objects.filter(subscriber=request.user, creator=creator).delete()
        return Response({'subscribed': False})

class SubscriptionStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, creator_id):
        creator = get_object_or_404(User, id=creator_id)
        subscribed = Subscription.objects.filter(subscriber=request.user, creator=creator).exists()
        count = creator.subscribers.count()
        return Response({'subscribed': subscribed, 'subscriber_count': count})

class SubscriptionsFeedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        creator_ids = request.user.subscriptions.values_list('creator_id', flat=True)
        from videos.models import Video
        from videos.serializers import VideoSerializer
        videos = Video.objects.filter(creator_id__in=creator_ids).order_by('-created_at')
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)