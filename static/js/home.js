// ホーム画面のインタラクティブ機能（フィルタリングとモーダル表示）

document.addEventListener('DOMContentLoaded', () => {
    // フィルター関連の要素取得
    const btnAll = document.getElementById('nav-btn-all');
    const btnPublic = document.getElementById('nav-btn-public');
    const btnPrivate = document.getElementById('nav-btn-private');
    const filterIndicator = document.getElementById('filter-text-indicator');
    const cards = document.querySelectorAll('.model-dashboard-card');

    // アップロードモーダル関連の要素取得
    const btnUpload = document.getElementById('nav-btn-upload');
    const btnUploadEmpty = document.getElementById('btn-upload-empty-trigger');
    const modalOverlay = document.getElementById('upload-modal');
    const modalClose = document.getElementById('modal-close-btn');

    // 1. フィルタリング機能
    const applyFilter = (filterType) => {
        let visibleCount = 0;

        cards.forEach(card => {
            const isPrivate = card.dataset.private === 'true';
            
            if (filterType === 'all') {
                card.classList.remove('hide');
                visibleCount++;
            } else if (filterType === 'public') {
                if (!isPrivate) {
                    card.classList.remove('hide');
                    visibleCount++;
                } else {
                    card.classList.add('hide');
                }
            } else if (filterType === 'private') {
                if (isPrivate) {
                    card.classList.remove('hide');
                    visibleCount++;
                } else {
                    card.classList.add('hide');
                }
            }
        });

        // フィルターインジケーターテキストの更新
        if (filterIndicator) {
            let label = 'My Model';
            if (filterType === 'public') label = 'Public (公開)';
            if (filterType === 'private') label = 'Private (非公開)';
            filterIndicator.textContent = `表示中: ${label} (${visibleCount}件)`;
        }
    };

    // フィルターボタンのアクティブ切り替え
    const setBtnActive = (activeBtn) => {
        [btnAll, btnPublic, btnPrivate].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
    };

    if (btnAll) {
        btnAll.addEventListener('click', (e) => {
            e.preventDefault();
            setBtnActive(btnAll);
            applyFilter('all');
        });
    }

    if (btnPublic) {
        btnPublic.addEventListener('click', (e) => {
            e.preventDefault();
            setBtnActive(btnPublic);
            applyFilter('public');
        });
    }

    if (btnPrivate) {
        btnPrivate.addEventListener('click', (e) => {
            e.preventDefault();
            setBtnActive(btnPrivate);
            applyFilter('private');
        });
    }

    // 2. モーダル表示切り替え
    const openModal = (e) => {
        if (e) e.preventDefault();
        if (modalOverlay) {
            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // 背後のスクロール防止
        }
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = ''; // スクロール復元
        }
    };

    if (btnUpload) {
        btnUpload.addEventListener('click', openModal);
    }
    if (btnUploadEmpty) {
        btnUploadEmpty.addEventListener('click', openModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // モーダルの外側クリックで閉じる
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // 初期化表示の反映
    applyFilter('all');
});
