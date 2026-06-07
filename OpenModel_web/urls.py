from django.contrib import admin
from django.contrib.staticfiles.urls import static
from django.urls import path, include
from . import settings_common, settings_develop

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', include('overview.urls')),
]

urlpatterns += static(settings_common.MEDIA_URL, document_root=settings_develop.MEDIA_ROOT)
