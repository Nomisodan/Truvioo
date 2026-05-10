from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, SubscribeView, SubscriptionStatusView, SubscriptionsFeedView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('<int:creator_id>/subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('<int:creator_id>/subscription-status/', SubscriptionStatusView.as_view(), name='subscription_status'),
    path('subscriptions/feed/', SubscriptionsFeedView.as_view(), name='subscriptions_feed'),
]