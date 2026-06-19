import uuid
from django.db import models
from django.core.validators import FileExtensionValidator
from accounts.models import CustomUser

class Model(models.Model):

    class ModelType(models.TextChoices):
        AVATURN = "avaturn", "Avaturn"
        OTHER = "other", "その他"
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(verbose_name='ネームタグ', max_length=100)
    uploaded_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.CASCADE)
    is_private = models.BooleanField(default=False)
    is_type = models.CharField(max_length=100, choices=ModelType.choices)
    glbfile = models.FileField(upload_to="glb/",
        validators=[
            FileExtensionValidator(
                allowed_extensions=["glb"]
            )
        ])
    avatarfile = models.FileField(upload_to="avatar/",
        validators=[
            FileExtensionValidator(
                allowed_extensions=["json"]
            )
        ],
        blank=True, null=True)
    glbfacefile = models.ImageField(upload_to="glbfacefile/")

    class Meta:
        verbose_name_plural = 'Model'

    def delete(self, *args, **kwargs):
        if self.glbfile:
            self.glbfile.delete(save=False)
        if self.avatarfile:
            self.avatarfile.delete(save=False)
        if self.glbfacefile:
            self.glbfacefile.delete(save=False)

        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name
