// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
    console.log('OpenModel - トップページが読み込まれました');

    // ユーザーアイコンクリックによるドロップダウンメニューの制御
    const avatarTrigger = document.getElementById('user-avatar-trigger');
    const userDropdown = document.getElementById('user-dropdown');

    if (avatarTrigger && userDropdown) {
        avatarTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // ドロップダウンメニュー自体をクリックしたときに閉じないように伝播を防ぐ
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 画面の他の場所をクリックしたときにドロップダウンを閉じる
        document.addEventListener('click', function() {
            if (userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // アカウント削除モーダルの制御
    const deleteTrigger = document.getElementById('delete-account-trigger');
    const deleteModal = document.getElementById('delete-confirm-modal');
    const deleteYesBtn = document.getElementById('delete-modal-yes');
    const deleteNoBtn = document.getElementById('delete-modal-no');

    if (deleteTrigger && deleteModal) {
        // モーダルを開く
        deleteTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (userDropdown) {
                userDropdown.classList.remove('show'); // ドロップダウンは閉じる
            }
            deleteModal.classList.add('open');
        });

        // いいえボタンでモーダルを閉じる
        if (deleteNoBtn) {
            deleteNoBtn.addEventListener('click', function() {
                deleteModal.classList.remove('open');
            });
        }

        // はいボタンで処理（モック動作）
        if (deleteYesBtn) {
            deleteYesBtn.addEventListener('click', function() {
                alert('UIモックのため、実際にはアカウントは削除されません。');
                deleteModal.classList.remove('open');
            });
        }
    }
});

// スクロール時のヘッダーエフェクト
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    }
});
