from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.views import generic
from django.views import View
from .models import Model

class IndexView(generic.TemplateView):
    template_name = "index.html"

class HomeView(generic.ListView):
    model = Model
    template_name = 'home.html'

    def get_queryset(self):
        models = Model.objects.filter(user=self.request.user).order_by('-uploaded_at')
        return models
    
class UnsubscribeView(LoginRequiredMixin, View):
    def post(self, request):
        password = request.POST.get("password")

        user = authenticate(request, username=request.user.username, password=password)

        if user is None:
            messages.error(request, "パスワードが正しくありません。")
            return redirect("overview:home")
        
        user = request.user
        logout(request)
        user.delete()
        messages.success(request, "退会が完了しました。")

        return redirect("overview:index")
    
class UploadView(LoginRequiredMixin, generic.CreateView):
    model = Model
    template_name = 'upload.html'