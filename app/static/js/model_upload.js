// モデルアップロードページのインタラクティブ機能

document.addEventListener('DOMContentLoaded', () => {

    
    // フォーム関連要素
    const uploadForm = document.getElementById('model-upload-form');
    const submitBtn = document.getElementById('upload-submit-btn');
    const submitText = document.getElementById('submit-btn-text');
    const submitSpinner = document.getElementById('submit-spinner');
    
    // モデルタイプとアバターファイルグループ of 連動制御
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

    // 自動キャプチャサムネイル用の隠しインプットと3Dビューアー
    const glbfaceInput = document.getElementById('id_glbfacefile');
    const glb3dViewer = document.getElementById('glb-3d-viewer');
    let currentGlbUrl = null;
    let currentSelectedFile = null;
    let captureCompleted = false;
    let submitAfterCapture = false;

    // アバター設定ファイルアップロード用
    const avatarDropZone = document.getElementById('avatar-drop-zone');
    const avatarPreviewContainer = document.getElementById('avatar-preview-container');
    const avatarFilename = document.getElementById('avatar-filename');
    const avatarFilesize = document.getElementById('avatar-filesize');
    const avatarRemoveBtn = document.getElementById('avatar-remove-btn');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');

    // accept属性の動的付与によるファイル選択ダイアログのフィルタリング
    if (glbInput) {
        glbInput.setAttribute('accept', '.glb');
    }
    if (avatarInput) {
        avatarInput.setAttribute('accept', '.json');
    }

    // ==========================================
    // 1. ドラッグ＆ドロップ共通イベントハンドラ
    // ==========================================
    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const highlightDropZone = (zone) => () => zone.classList.add('dragover');
    const unhighlightDropZone = (zone) => () => zone.classList.remove('dragover');

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

    // ==========================================
    // 2. GLBファイルの制御
    // ==========================================
    const handleGlbFileSelect = (file) => {
        if (!file) return;
        
        // 拡張子チェック
        if (!file.name.toLowerCase().endsWith('.glb')) {
            alert('対応している形式は .glb のみです。');
            resetGlbPreview();
            return;
        }
        
        // キャプチャ完了状態をリセット
        captureCompleted = false;
        submitAfterCapture = false;
        
        // ファイル名を保持
        currentSelectedFile = file;

        // 古いBlob URLの破棄と新しいURLの適用
        if (currentGlbUrl) {
            URL.revokeObjectURL(currentGlbUrl);
        }
        currentGlbUrl = URL.createObjectURL(file);
        if (glb3dViewer) {
            glb3dViewer.src = currentGlbUrl;
        }

        // ファイル名とサイズの表示
        if (glbFilename) glbFilename.textContent = file.name;
        if (glbFilesize) glbFilesize.textContent = formatBytes(file.size);
        
        // プレビューの表示切り替え
        if (glbPreview) glbPreview.classList.add('active');
        if (glbPlaceholder) glbPlaceholder.style.display = 'none';
        
        // ドロップゾーンにファイル選択済みのクラスを追加
        if (glbDropZone) glbDropZone.classList.add('has-file');
    };

    const resetGlbPreview = () => {
        if (glbInput) glbInput.value = '';
        if (glbfaceInput) glbfaceInput.value = ''; // キャプチャ画像インプットもクリア
        if (glbPreview) glbPreview.classList.remove('active');
        if (glbPlaceholder) glbPlaceholder.style.display = 'flex';
        
        // ドロップゾーンからファイル選択済みのクラスを削除
        if (glbDropZone) glbDropZone.classList.remove('has-file');

        // model-viewerのsrcをクリア
        if (glb3dViewer) {
            glb3dViewer.removeAttribute('src');
        }

        // URLオブジェクトをメモリから解放
        if (currentGlbUrl) {
            URL.revokeObjectURL(currentGlbUrl);
            currentGlbUrl = null;
        }
        currentSelectedFile = null;
        captureCompleted = false;
        submitAfterCapture = false;
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

    // ==========================================
    // 2.5 3Dモデル読み込み完了時の自動キャプチャ処理
    // ==========================================
    if (glb3dViewer) {
        glb3dViewer.addEventListener('load', async () => {
            if (!currentSelectedFile) return;

            
            try {
                // カスタム要素が定義されるまで待機する
                if (window.customElements) {
                    await customElements.whenDefined('model-viewer');
                }

                // カメラ位置と視野角を明示的に設定（背面ではなく正面から撮影するために180degに設定）
                glb3dViewer.setAttribute('camera-orbit', '180deg 75deg 250%');
                glb3dViewer.setAttribute('field-of-view', '60deg');
                glb3dViewer.cameraOrbit = "180deg 75deg 250%"; // 180deg回転して正面に配置し、250%離す
                glb3dViewer.fieldOfView = "60deg";
                
                // jumpToGoal メソッドの存在チェックと適用
                let waitTime = 1500; // モデルの初期化とカメラ位置の安定のために十分な時間（1500ms）を確保
                if (typeof glb3dViewer.jumpToGoal === 'function') {
                    glb3dViewer.jumpToGoal();
                }
                
                // カメラ遷移完了とレンダリングの安定を待つ
                await new Promise(resolve => setTimeout(resolve, waitTime));
                
                const blob = await glb3dViewer.toBlob({
                    mimeType: 'image/png',
                    idealAspect: true
                });
                
                if (blob) {
                    const fileName = currentSelectedFile.name.replace(/\.[^/.]+$/, "") + "_face.png";
                    const faceFile = new File([blob], fileName, { type: 'image/png' });
                    
                    const container = new DataTransfer();
                    container.items.add(faceFile);
                    if (glbfaceInput) {
                        glbfaceInput.files = container.files;
                    }
                    
                    captureCompleted = true;
                    
                    // 送信ボタンが押されて待機状態だった場合、自動でフォームを送信
                    if (submitAfterCapture && uploadForm) {
                        uploadForm.submit();
                    }
                }
            } catch (err) {
                console.error('Failed to capture GLB face image:', err);
            }
        });
    }

    // ==========================================
    // 3. 設定ファイル (アバターファイル) の制御
    // ==========================================
    const handleAvatarFileSelect = (file) => {
        if (!file) return;

        // 拡張子チェック
        if (!file.name.toLowerCase().endsWith('.json')) {
            alert('対応している形式は .json のみです。');
            resetAvatarPreview();
            return;
        }

        if (avatarFilename) avatarFilename.textContent = file.name;
        if (avatarFilesize) avatarFilesize.textContent = formatBytes(file.size);

        if (avatarPreviewContainer) {
            avatarPreviewContainer.classList.add('active');
        }
        if (avatarPlaceholder) {
            avatarPlaceholder.style.display = 'none';
        }
        
        // ドロップゾーンにファイル選択済みのクラスを追加
        if (avatarDropZone) avatarDropZone.classList.add('has-file');
    };

    const resetAvatarPreview = () => {
        if (avatarInput) avatarInput.value = '';
        if (avatarPreviewContainer) avatarPreviewContainer.classList.remove('active');
        if (avatarPlaceholder) avatarPlaceholder.style.display = 'flex';
        
        // ドロップゾーンからファイル選択済みのクラスを削除
        if (avatarDropZone) avatarDropZone.classList.remove('has-file');
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

    // ==========================================
    // 4. モデルタイプとアバター入力エリアの連動
    // ==========================================
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

    // ==========================================
    // 5. ユーティリティ: バイト数表示フォーマット
    // ==========================================
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // ==========================================
    // 6. フォーム送信時のローディング処理
    // ==========================================
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            // キャプチャ画像生成がまだ完了していない場合、送信を保留して待機する
            if (glbInput && glbInput.files.length > 0 && !captureCompleted) {
                e.preventDefault();
                submitAfterCapture = true;
                
                // 送信ボタンを「処理中...」に変更して無効化
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
                if (submitText) {
                    submitText.textContent = '3Dモデル処理中...';
                }
                if (submitSpinner) {
                    submitSpinner.classList.add('active');
                }
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
