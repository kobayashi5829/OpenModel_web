// モデルアップロードページのインタラクティブ機能

document.addEventListener('DOMContentLoaded', () => {
    // フォーム関連要素
    const uploadForm = document.getElementById('model-upload-form');
    const submitBtn = document.getElementById('upload-submit-btn');
    const submitText = document.getElementById('submit-btn-text');
    const submitSpinner = document.getElementById('submit-spinner');
    
    // モデルタイプとアバターファイルグループの連動制御
    const modelTypeSelect = document.getElementById('id_is_type');
    const avatarGroup = document.getElementById('avatar-upload-group');
    const avatarInput = document.getElementById('id_avaterfile');
    
    // GLBファイルアップロード用
    const glbDropZone = document.getElementById('glb-drop-zone');
    const glbInput = document.getElementById('id_glbfile');
    const glbPreview = document.getElementById('glb-preview');
    const glbFilename = document.getElementById('glb-filename');
    const glbFilesize = document.getElementById('glb-filesize');
    const glbRemoveBtn = document.getElementById('glb-remove-btn');
    const glbPlaceholder = document.getElementById('glb-placeholder');

    // アバターサムネイル画像アップロード用
    const avatarDropZone = document.getElementById('avatar-drop-zone');
    const avatarPreviewContainer = document.getElementById('avatar-preview-container');
    const avatarImgPreview = document.getElementById('avatar-img-preview');
    const avatarFilename = document.getElementById('avatar-filename');
    const avatarFilesize = document.getElementById('avatar-filesize');
    const avatarRemoveBtn = document.getElementById('avatar-remove-btn');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');

    // 1. モデルタイプに応じたアバターファイル入力エリアの表示制御
    const toggleAvatarUploadVisibility = () => {
        if (!modelTypeSelect || !avatarGroup) return;
        
        // is_type が "other" (その他) の時のみアバターファイル入力エリアを表示する
        if (modelTypeSelect.value === 'other') {
            avatarGroup.classList.remove('fade-out');
            avatarGroup.classList.add('fade-in');
        } else {
            avatarGroup.classList.remove('fade-in');
            avatarGroup.classList.add('fade-out');
            // 非表示にする場合は、選択されていたファイルをクリアする
            if (avatarInput) {
                avatarInput.value = '';
            }
            // プレビュー表示もリセットする
            resetAvatarPreview();
        }
    };

    if (modelTypeSelect) {
        modelTypeSelect.addEventListener('change', toggleAvatarUploadVisibility);
        // 初期化時にも実行する (フォーム再表示等への対応)
        toggleAvatarUploadVisibility();
    }

    // 2. ドラッグ＆ドロップ共通イベントハンドラ
    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const highlightDropZone = (zone) => () => zone.classList.add('dragover');
    const unhighlightDropZone = (zone) => () => zone.classList.remove('dragover');

    // ドラッグ＆ドロップイベントリスナー登録用
    const setupDragAndDrop = (zone, input, fileHandler) => {
        if (!zone || !input) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, highlightDropZone(zone), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, unhighlightDropZone(zone), false);
        });

        zone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                input.files = files; // input要素にファイルをセット
                fileHandler(files[0]);
                // Changeイベントを手動でトリガー
                input.dispatchEvent(new Event('change'));
            }
        });
    };

    // 3. GLBファイルの制御
    const handleGlbFileSelect = (file) => {
        if (!file) return;
        
        // ファイル名とサイズの表示
        if (glbFilename) glbFilename.textContent = file.name;
        if (glbFilesize) glbFilesize.textContent = formatBytes(file.size);
        
        // プレビューの表示切り替え
        if (glbPreview) glbPreview.classList.add('active');
        if (glbPlaceholder) glbPlaceholder.style.display = 'none';
    };

    const resetGlbPreview = () => {
        if (glbInput) glbInput.value = '';
        if (glbPreview) glbPreview.classList.remove('active');
        if (glbPlaceholder) glbPlaceholder.style.display = 'flex';
    };

    if (glbInput) {
        glbInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleGlbFileSelect(e.target.files[0]);
            }
        });
    }

    if (glbRemoveBtn) {
        glbRemoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetGlbPreview();
        });
    }

    // GLBファイルのドラッグ＆ドロップセットアップ
    setupDragAndDrop(glbDropZone, glbInput, handleGlbFileSelect);


    // 4. 設定ファイル (アバターファイル) の制御
    const handleAvatarFileSelect = (file) => {
        if (!file) return;

        if (avatarFilename) avatarFilename.textContent = file.name;
        if (avatarFilesize) avatarFilesize.textContent = formatBytes(file.size);

        if (avatarPreviewContainer) {
            avatarPreviewContainer.classList.add('active');
        }
        if (avatarPlaceholder) {
            avatarPlaceholder.style.display = 'none';
        }
    };

    const resetAvatarPreview = () => {
        if (avatarInput) avatarInput.value = '';
        if (avatarPreviewContainer) avatarPreviewContainer.classList.remove('active');
        if (avatarPlaceholder) avatarPlaceholder.style.display = 'flex';
    };

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleAvatarFileSelect(e.target.files[0]);
            }
        });
    }

    if (avatarRemoveBtn) {
        avatarRemoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetAvatarPreview();
        });
    }

    // アバター画像のドラッグ＆ドロップセットアップ
    setupDragAndDrop(avatarDropZone, avatarInput, handleAvatarFileSelect);


    // 5. ユーティリティ: バイト数表示フォーマット
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


    // 6. フォーム送信時の処理 (ローディング表現)
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            // GLBファイルが添付されているか最終確認
            if (glbInput && glbInput.files.length === 0) {
                e.preventDefault();
                alert('GLBファイルを選択してください。');
                return;
            }

            // 送信ボタンの無効化とスピナーの開始
            if (submitBtn) {
                submitBtn.disabled = true;
            }
            if (submitText) {
                submitText.textContent = 'アップロード中...';
            }
            if (submitSpinner) {
                submitSpinner.classList.add('active');
            }
        });
    }
});
