from allauth.account.forms import SignupForm

class CustomSignupForm(SignupForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # フォームのフィールド定義からメールアドレスを削除する
        if 'email' in self.fields:
            del self.fields['email']
