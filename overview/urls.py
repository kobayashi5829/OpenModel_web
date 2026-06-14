from django.urls import path
from . import views

app_name = 'overview'
urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('home/', views.HomeView.as_view(), name="home"),
    path('model-upload/', views.ModelUploadView.as_view(), name="model-upload"),
    path('model-detail/<uuid:pk>/', views.ModelDetailView.as_view(), name="model-detail"),
    path('model-delete/<uuid:pk>/', views.ModelDeleteView.as_view(), name="model-delete"),
    path('unsubscribe/', views.UnsubscribeView.as_view(), name="unsubscribe"),
]