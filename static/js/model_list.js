// モデル一覧共通のリアルタイム検索＆フィルタリング機能

document.addEventListener('DOMContentLoaded', () => {
    // 共通要素の取得
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const noResultsWrapper = document.getElementById('no-search-results');
    const filterIndicator = document.getElementById('filter-text-indicator');
    const cards = document.querySelectorAll('.model-dashboard-card');

    // 画面種別の判定
    // ホーム画面は nav-btn-all が存在する
    const btnAll = document.getElementById('nav-btn-all');
    const btnPublic = document.getElementById('nav-btn-public');
    const btnPrivate = document.getElementById('nav-btn-private');
    const isHome = !!btnAll;

    // 現在の状態
    let currentFilter = 'all';
    let currentSearchQuery = '';

    // フィルタリングと検索の適用
    const applyFilterAndSearch = () => {
        let visibleCount = 0;
        const query = currentSearchQuery.toLowerCase().trim();

        cards.forEach(card => {
            // カード内のモデル名（h3タグ）を取得
            const modelNameEl = card.querySelector('.model-info-body h3');
            const modelName = modelNameEl ? modelNameEl.textContent.toLowerCase() : '';

            // 1. フィルター判定
            let matchesFilter = true;
            if (isHome) {
                const isPrivate = card.dataset.private === 'true';
                if (currentFilter === 'public') {
                    matchesFilter = !isPrivate;
                } else if (currentFilter === 'private') {
                    matchesFilter = isPrivate;
                }
            }

            // 2. 検索判定
            let matchesSearch = false;
            if (isHome) {
                matchesSearch = modelName.includes(query);
            } else {
                // パブリックルームはアップロード者名も検索対象
                const username = card.dataset.username ? card.dataset.username.toLowerCase() : '';
                matchesSearch = modelName.includes(query) || username.includes(query);
            }

            // 3. 表示トグル (親の a タグのリンク要素をトグルしてグリッドから完全に除外)
            const cardLink = card.closest('.model-card-link');
            if (cardLink) {
                if (matchesFilter && matchesSearch) {
                    cardLink.style.display = 'block';
                    visibleCount++;
                } else {
                    cardLink.style.display = 'none';
                }
            }
        });

        // 4. インジケーターテキストの更新
        if (filterIndicator) {
            if (isHome) {
                let label = 'My Model';
                if (currentFilter === 'public') label = 'Public (公開)';
                if (currentFilter === 'private') label = 'Private (非公開)';
                
                if (query) {
                    filterIndicator.textContent = `表示中: ${label} [検索: "${currentSearchQuery}"] (${visibleCount}件)`;
                } else {
                    filterIndicator.textContent = `表示中: ${label} (${visibleCount}件)`;
                }
            } else {
                if (query) {
                    filterIndicator.textContent = `表示中: パブリック [検索: "${currentSearchQuery}"] (${visibleCount}件)`;
                } else {
                    filterIndicator.textContent = `公開モデル一覧 (${visibleCount}件)`;
                }
            }
        }

        // 5. 検索結果が0件の場合のプレースホルダーのトグル
        if (noResultsWrapper) {
            if (visibleCount === 0 && cards.length > 0) {
                noResultsWrapper.style.display = 'block';
            } else {
                noResultsWrapper.style.display = 'none';
            }
        }
    };

    // ホーム画面限定のタブクリックイベントの登録
    if (isHome) {
        const setFilter = (filterType, activeBtn) => {
            currentFilter = filterType;
            [btnAll, btnPublic, btnPrivate].forEach(btn => {
                if (btn) btn.classList.remove('active');
            });
            if (activeBtn) activeBtn.classList.add('active');
            applyFilterAndSearch();
        };

        if (btnAll) btnAll.addEventListener('click', () => setFilter('all', btnAll));
        if (btnPublic) btnPublic.addEventListener('click', () => setFilter('public', btnPublic));
        if (btnPrivate) btnPrivate.addEventListener('click', () => setFilter('private', btnPrivate));
    }

    // 検索入力のイベント監視
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
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

    // 検索入力の初期状態に応じてクリアボタンの表示を更新
    if (searchClearBtn) {
        searchClearBtn.style.display = searchInput && searchInput.value ? 'flex' : 'none';
    }

    // 初期化表示の反映
    applyFilterAndSearch();
});
