import uuid
from django.db import models
from django.core.validators import FileExtensionValidator
from accounts.models import CustomUser

class Model(models.Model):

    class ModelType(models.TextChoices):
        AVATERN = "avatern", "Avatern"
        OTHER = "other", "その他"
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(verbose_name='ネームタグ', max_length=100)
    uploaded_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)
    user = models.ForeignKey(CustomUser, verbose_name='ユーザー', on_delete=models.CASCADE)
    is_private = models.BooleanField(default=False)
    is_type = models.CharField(max_length=100, choices=ModelType.choices)
    glbfile = models.FileField(upload_to="glb/", blank=False,
        validators=[
            FileExtensionValidator(
                allowed_extensions=["glb"]
            )
        ])
    avaterfile = models.FileField(upload_to="avater/",
        validators=[
            FileExtensionValidator(
                allowed_extensions=["json"]
            )
        ],
        blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Model'

    def __str__(self):
        return self.name
