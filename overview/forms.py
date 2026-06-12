from django import forms
from .models import Model

class ModelUploadForm(forms.ModelForm):
    class Meta:
        model = Model
        fields = ('name', 'is_type', 'is_private', 'glbfile', 'avaterfile')