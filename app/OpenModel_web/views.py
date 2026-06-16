from django.contrib.auth import views
from django.core.exceptions import PermissionDenied

class CustomPasswordResetView(views.PasswordResetView):
    def dispatch(self, request, *args, **kwargs):
        raise PermissionDenied