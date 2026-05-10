from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    display_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.display_name

class Subscription(models.Model):
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscribers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('subscriber', 'creator')