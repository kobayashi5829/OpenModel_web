// ホーム画面のインタラクティブ機能（フィルタリング＆リアルタイム検索）

document.addEventListener('DOMContentLoaded', () => {
    // フィルター関連の要素取得
    const btnAll = document.getElementById('nav-btn-all');
    const btnPublic = document.getElementById('nav-btn-public');
    const btnPrivate = document.getElementById('nav-btn-private');
    const filterIndicator = document.getElementById('filter-text-indicator');
    const cards = document.querySelectorAll('.model-dashboard-card');

    // 検索関連の要素取得
    const searchInput = document.getElementById('home-search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const noResultsWrapper = document.getElementById('no-search-results');

    // 現在のフィルター状態と検索状態を保持
    let currentFilter = 'all';
    let currentSearchQuery = '';

    // フィルターと検索を統合した絞り込み処理
    const applyFilterAndSearch = () => {
        let visibleCount = 0;
        const query = currentSearchQuery.toLowerCase().trim();

        cards.forEach(card => {
            const isPrivate = card.dataset.private === 'true';
            
            // カード内のモデル名（h3タグ）を取得
            const modelNameEl = card.querySelector('.model-info-body h3');
            const modelName = modelNameEl ? modelNameEl.textContent.toLowerCase() : '';

            // 1. 公開/非公開フィルターの条件判定
            let matchesFilter = false;
            if (currentFilter === 'all') {
                matchesFilter = true;
            } else if (currentFilter === 'public') {
                matchesFilter = !isPrivate;
            } else if (currentFilter === 'private') {
                matchesFilter = isPrivate;
            }

            // 2. 検索キーワードの条件判定
            const matchesSearch = modelName.includes(query);

            // 両方の条件を満たす場合のみ表示
            if (matchesFilter && matchesSearch) {
                card.classList.remove('hide');
                visibleCount++;
            } else {
                card.classList.add('hide');
            }
        });

        // 3. インジケーターテキストの更新
        if (filterIndicator) {
            let label = 'My Model';
            if (currentFilter === 'public') label = 'Public (公開)';
            if (currentFilter === 'private') label = 'Private (非公開)';
            
            if (query) {
                filterIndicator.textContent = `表示中: ${label} [検索: "${currentSearchQuery}"] (${visibleCount}件)`;
            } else {
                filterIndicator.textContent = `表示中: ${label} (${visibleCount}件)`;
            }
        }

        // 4. 検索結果が0件の場合のプレースホルダーのトグル
        if (noResultsWrapper) {
            if (visibleCount === 0 && cards.length > 0) {
                noResultsWrapper.style.display = 'block';
            } else {
                noResultsWrapper.style.display = 'none';
            }
        }
    };

    // フィルターボタンのアクティブ切り替え
    const setBtnActive = (activeBtn) => {
        [btnAll, btnPublic, btnPrivate].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
    };

    // フィルターボタンのイベント登録
    if (btnAll) {
        btnAll.addEventListener('click', (e) => {
            e.preventDefault();
            setBtnActive(btnAll);
            currentFilter = 'all';
            applyFilterAndSearch();
        });
    }

    if (btnPublic) {
        btnPublic.addEventListener('click', (e) => {
            e.preventDefault();
            setBtnActive(btnPublic);
            currentFilter = 'public';
            applyFilterAndSearch();
        });
    }

    if (btnPrivate) {
        btnPrivate.addEventListener('click', (e) => {
            e.preventDefault();
            setBtnActive(btnPrivate);
            currentFilter = 'private';
            applyFilterAndSearch();
        });
    }

    // 検索入力のイベント監視
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            
            // クリアボタンの表示/非表示トグル
            if (searchClearBtn) {
                searchClearBtn.style.display = currentSearchQuery ? 'flex' : 'none';
            }
            
            applyFilterAndSearch();
        });
    }

    // 検索クリアボタンのイベント登録
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                currentSearchQuery = '';
                searchClearBtn.style.display = 'none';
                searchInput.focus();
                applyFilterAndSearch();
            }
        });
    }

    // 初期化表示の反映
    applyFilterAndSearch();
});
