from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.views import generic
from django.views import View
from django.urls import reverse_lazy
from .models import Model
from .forms import ModelUploadForm

class IndexView(generic.TemplateView):
    template_name = "index.html"

class HomeView(generic.ListView):
    model = Model
    template_name = 'home.html'

    def get_queryset(self):
        models = Model.objects.filter(user=self.request.user).order_by('-uploaded_at')
        return models

class ModelDetailView(LoginRequiredMixin, generic.DetailView):
    model = Model
    template_name = 'model_detail.html'

class ModelUploadView(LoginRequiredMixin, generic.CreateView):
    model = Model
    template_name = 'model_upload.html'
    form_class = ModelUploadForm
    success_url = reverse_lazy('overview:home')
    
    def form_valid(self, form):
        model = form.save(commit=False)
        model.user = self.request.user
        model.save()
        messages.success(self.request, 'モデルアップロードを完了しました。')
        return super().form_valid(form)
        
    def form_invalid(self, form):
        messages.error(self.request, 'モデルアップロードに失敗しました。')
        return super().form_invalid(form)
    
class ModelDeleteView(LoginRequiredMixin, generic.DeleteView):
    model = Model
    success_url = reverse_lazy('overview:home')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "モデルを削除しました。")
        return super().delete(request, *args, **kwargs)
    
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