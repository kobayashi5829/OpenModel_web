from django import forms
from .models import Model

class ModelUploadForm(forms.ModelForm):
    # ネームタグをフォーム上で必須（required=True）として定義
    name = forms.CharField(
        label='ネームタグ', 
        required=True, 
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'ネームタグを入力してください'})
    )

    class Meta:
        model = Model
        fields = ('name', 'is_type', 'is_private', 'glbfile', 'avatarfile', 'glbfacefile')

    def clean_glbfile(self):
        glbfile = self.cleaned_data.get('glbfile')
        # 拡張子が .glb であるかチェック
        if glbfile and not glbfile.name.lower().endswith('.glb'):
            raise forms.ValidationError('対応している形式は .glb のみです。')
        return glbfile

    def clean(self):
        cleaned_data = super().clean()
        is_type = cleaned_data.get('is_type')
        avatarfile = cleaned_data.get('avatarfile')

        # モデルタイプが「その他」の場合、avatarfileを必須にする
        if is_type == 'other':
            if not avatarfile:
                self.add_error('avatarfile', 'モデルタイプが「その他」の場合は、Avatarファイル（.json）が必須です。')
            elif not avatarfile.name.lower().endswith('.json'):
                self.add_error('avatarfile', '対応している形式は .json のみです。')
            
        return cleaned_data