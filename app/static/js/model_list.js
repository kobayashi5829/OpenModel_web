// モデル一覧共通のリアルタイム検索＆フィルタリング機能

document.addEventListener('DOMContentLoaded', () => {
    console.log("model_list.js loaded - version 4 - Debug logs enabled");

    // 共通要素の取得
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const noResultsWrapper = document.getElementById('no-search-results');
    const filterIndicator = document.getElementById('filter-text-indicator');
    const cards = document.querySelectorAll('.model-dashboard-card');

    // data-page-type 属性から画面種別を確実に判定 (home または public)
    const sectionEl = document.querySelector('.home-section');
    const pageType = sectionEl && sectionEl.dataset.pageType ? sectionEl.dataset.pageType.trim().toLowerCase() : 'home';
    const isHome = pageType === 'home';

    console.log("Page identification:", { pageType, isHome, cardsFound: cards.length });

    // 現在の状態
    let currentSearchQuery = '';

    // フィルタリングと検索の適用
    const applyFilterAndSearch = () => {
        let visibleCount = 0;
        const query = currentSearchQuery.toLowerCase().trim();
        // スペース（半角・全角）で区切って複数キーワードの配列を作成
        const keywords = query.split(/[\s　]+/).filter(k => k !== '');

        console.log("Filtering starts with keywords:", keywords);

        cards.forEach((card, index) => {
            // カード内のモデル名（h3タグ）を取得
            const modelNameEl = card.querySelector('.model-info-body h3');
            const modelName = modelNameEl ? modelNameEl.textContent.trim().toLowerCase() : '';

            // 検索判定 (複数キーワードがある場合はすべてのキーワードに部分一致するか判定: AND検索)
            let matchesSearch = true;
            if (keywords.length > 0) {
                matchesSearch = keywords.every(keyword => {
                    if (isHome) {
                        // マイモデル画面: モデル名での部分一致検索
                        const match = modelName.includes(keyword);
                        console.log(`[Home] Card #${index} "${modelName}" vs "${keyword}" -> match:`, match);
                        return match;
                    } else {
                        // パブリックルーム: モデル名または作者名での部分一致検索
                        const username = card.dataset.username ? card.dataset.username.trim().toLowerCase() : '';
                        const matchName = modelName.includes(keyword);
                        const matchUser = username.includes(keyword);
                        console.log(`[Public] Card #${index} "${modelName}" (user: "${username}") vs "${keyword}" -> matchName: ${matchName}, matchUser: ${matchUser}`);
                        return matchName || matchUser;
                    }
                });
            }

            // 表示トグル (親の a タグのリンク要素をトグルしてグリッドから完全に除外)
            const cardLink = card.closest('.model-card-link');
            if (cardLink) {
                if (matchesSearch) {
                    cardLink.style.display = '';
                    visibleCount++;
                } else {
                    cardLink.style.display = 'none';
                }
            }
        });

        console.log(`Filtering complete. Visible count: ${visibleCount}/${cards.length}`);

        // インジケーターテキストの更新
        if (filterIndicator) {
            if (isHome) {
                if (query) {
                    filterIndicator.textContent = `表示中: My Model [検索: "${currentSearchQuery}"] (${visibleCount}件)`;
                } else {
                    filterIndicator.textContent = `表示中: My Model (${visibleCount}件)`;
                }
            } else {
                if (query) {
                    filterIndicator.textContent = `表示中: パブリック [検索: "${currentSearchQuery}"] (${visibleCount}件)`;
                } else {
                    filterIndicator.textContent = `公開モデル一覧 (${visibleCount}件)`;
                }
            }
        }

        // 検索結果が0件の場合のプレースホルダーのトグル
        if (noResultsWrapper) {
            if (visibleCount === 0 && cards.length > 0) {
                noResultsWrapper.style.display = 'block';
            } else {
                noResultsWrapper.style.display = 'none';
            }
        }
    };

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
