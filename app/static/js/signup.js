// サインアップページのインタラクティブ機能

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('id_password1');
    const passwordConfirmInput = document.getElementById('id_password2');
    const signupForm = document.querySelector('.signup-card form');
    const submitBtn = document.querySelector('.btn-signup');

    if (!passwordInput || !passwordConfirmInput) return;

    // パスワード強度表示用のDOM要素を作成して挿入
    const strengthContainer = document.createElement('div');
    strengthContainer.className = 'password-strength-container';
    strengthContainer.innerHTML = `
        <div class="strength-bar-bg">
            <div class="strength-bar" id="strength-bar"></div>
        </div>
        <span class="strength-text" id="strength-text">強度: 未入力</span>
    `;
    passwordInput.parentNode.appendChild(strengthContainer);

    // パスワード一致確認用のDOM要素を作成して挿入
    const matchError = document.createElement('div');
    matchError.className = 'js-validation-error';
    matchError.id = 'password-match-error';
    matchError.textContent = 'パスワードが一致しません';
    passwordConfirmInput.parentNode.appendChild(matchError);

    // パスワード強度チェック関数
    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length === 0) return { score: 0, label: '未入力', color: '#e2e8f0', width: '0%' };
        
        // 判定基準
        if (password.length >= 8) score++; // 長さ
        if (/[A-Z]/.test(password)) score++; // 大文字
        if (/[a-z]/.test(password)) score++; // 小文字
        if (/[0-9]/.test(password)) score++; // 数字
        if (/[^A-Za-z0-9]/.test(password)) score++; // 記号

        switch(score) {
            case 1:
                return { score: 1, label: '非常に弱い', color: '#e74c3c', width: '25%' };
            case 2:
                return { score: 2, label: '弱い', color: '#e67e22', width: '50%' };
            case 3:
                return { score: 3, label: '普通', color: '#f1c40f', width: '75%' };
            case 4:
            case 5:
                return { score: 4, label: '強い', color: '#2ecc71', width: '100%' };
            default:
                return { score: 0, label: '非常に弱い', color: '#e74c3c', width: '10%' };
        }
    };

    // パスワード入力時のイベント
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        const strength = checkPasswordStrength(val);
        
        const bar = document.getElementById('strength-bar');
        const text = document.getElementById('strength-text');
        
        bar.style.width = strength.width;
        bar.style.backgroundColor = strength.color;
        text.textContent = `強度: ${strength.label}`;
        text.style.color = strength.color === '#e2e8f0' ? '#7f8c8d' : strength.color;

        validatePasswords();
    });

    // 確認用パスワード入力時のイベント
    passwordConfirmInput.addEventListener('input', () => {
        validatePasswords();
    });

    // パスワードの一致と妥当性のチェック
    const validatePasswords = () => {
        const p1 = passwordInput.value;
        const p2 = passwordConfirmInput.value;

        let isValid = true;

        if (p2.length > 0 && p1 !== p2) {
            matchError.style.display = 'block';
            passwordConfirmInput.parentNode.classList.add('has-error');
            isValid = false;
        } else {
            matchError.style.display = 'none';
            passwordConfirmInput.parentNode.classList.remove('has-error');
        }

        // 送信ボタンの制御 (不一致の場合は無効化)
        if (p1 !== p2 && p2.length > 0) {
            submitBtn.disabled = true;
        } else {
            submitBtn.disabled = false;
        }

        return isValid;
    };

    // フォーム送信時の追加チェック
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            if (!validatePasswords()) {
                e.preventDefault();
            }
        });
    }
});
