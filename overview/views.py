from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from .models import Model

class IndexView(generic.TemplateView):
    template_name = "index.html"

class HomeView(generic.ListView):
    model = Model
    template_name = 'home.html'

    def get_queryset(self):
        models = Model.objects.filter(user=self.request.user).order_by('-uploaded_at')
        return models