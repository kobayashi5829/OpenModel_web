from django.urls import path
from . import views

app_name = 'overview'
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('home/', views.HomeView.as_view(), name="home"),
    path('model-upload/', views.ModelUploadView.as_view(), name="model_upload"),
    path('unsubscribe/', views.UnsubscribeView.as_view(), name="unsubscribe"),
]