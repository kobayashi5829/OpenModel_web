// ログインページのインタラクティブ機能

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('id_password');
    
    if (passwordInput) {
        // パスワード入力フィールドをラッパーで包む
        const wrapper = document.createElement('div');
        wrapper.className = 'password-field-wrapper';
        
        // 元のinputの位置にラッパーを挿入し、その中にinputを移す
        passwordInput.parentNode.insertBefore(wrapper, passwordInput);
        wrapper.appendChild(passwordInput);
        
        // 表示/非表示切り替えボタンを作成
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle-btn';
        toggleBtn.textContent = '表示';
        wrapper.appendChild(toggleBtn);
        
        // クリックイベント
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '非表示';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '表示';
            }
        });
    }

    // フォーム送信時の処理（送信ボタンの二重送信防止など）
    const loginForm = document.querySelector('.login-card form');
    const submitBtn = document.querySelector('.btn-login');

    if (loginForm && submitBtn) {
        loginForm.addEventListener('submit', () => {
            submitBtn.disabled = true;
            submitBtn.textContent = 'サインイン中...';
        });
    }
});
