from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    my_model = models.OneToOneField("overview.Model", on_delete=models.SET_NULL, blank=True, null=True)
    
    class Meta:
        verbose_name_plural = 'CustomUser'