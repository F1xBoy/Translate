document.addEventListener('DOMContentLoaded', () => {
    // ============ DOM ELEMENTS ============
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const swapBtn = document.getElementById('swapBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const sourceDropdown = document.getElementById('sourceDropdown');
    const targetDropdown = document.getElementById('targetDropdown');
    const charCount = document.getElementById('charCount');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const copyFeedback = document.getElementById('copyFeedback');
    const listenSourceBtn = document.getElementById('listenSourceBtn');
    const listenTargetBtn = document.getElementById('listenTargetBtn');

    const tabBtns = document.querySelectorAll('.tab-btn');
    const textTab = document.getElementById('textTab');
    const documentTab = document.getElementById('documentTab');
    const imageTab = document.getElementById('imageTab');

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const fileInfo = document.getElementById('fileInfo');
    const fileNameDisplay = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const translationProgress = document.getElementById('translationProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const downloadArea = document.getElementById('downloadArea');
    const downloadBtn = document.getElementById('downloadBtn');

    const imageDropZone = document.getElementById('imageDropZone');
    const imageInput = document.getElementById('imageInput');
    const imageBrowseBtn = document.getElementById('imageBrowseBtn');
    const imageUploadPlaceholder = document.getElementById('imageUploadPlaceholder');
    const imageFileInfo = document.getElementById('imageFileInfo');
    const imageFileName = document.getElementById('imageFileName');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const imageResultContainer = document.getElementById('imageResultContainer');
    const imagePreview = document.getElementById('imagePreview');
    const translatedImageText = document.getElementById('translatedImageText');
    const copyImageTextBtn = document.getElementById('copyImageTextBtn');
    const imageProgress = document.getElementById('imageProgress');
    const imageProgressText = document.getElementById('imageProgressText');
    const imageProgressFill = document.getElementById('imageProgressFill');
    const overlayLayer = document.getElementById('overlayLayer');
    const viewOriginalBtn = document.getElementById('viewOriginalBtn');
    const viewTranslatedBtn = document.getElementById('viewTranslatedBtn');

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeList = document.getElementById('themeList');

    // ============ THEME ============
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('open');
    });

    themeList.querySelectorAll('li').forEach(item => {
        if (item.dataset.value === savedTheme) item.classList.add('selected');
        else item.classList.remove('selected');

        item.addEventListener('click', () => {
            localStorage.setItem('theme', item.dataset.value);
            location.reload();
        });
    });

    document.addEventListener('click', (e) => {
        if (!themeDropdown.contains(e.target)) themeDropdown.classList.remove('open');
    });

    // ============ STATE ============
    const MAX_CHARS = 5000;
    let currentMode = 'text';
    let currentFile = null;
    let currentImageFile = null;
    let currentObjectURL = null;

    const LANGUAGES = {
        "af": "Afrikaans", "sq": "Albanian", "am": "Amharic", "ar": "Arabic", "hy": "Armenian", "as": "Assamese", "ay": "Aymara", "az": "Azerbaijani", "bm": "Bambara", "ba": "Bashkir", "eu": "Basque", "be": "Belarusian", "bn": "Bengali", "bho": "Bhojpuri", "bs": "Bosnian", "bg": "Bulgarian", "ca": "Catalan", "ceb": "Cebuano", "ny": "Chichewa", "zh-CN": "Chinese (Simp)", "zh-TW": "Chinese (Trad)", "cv": "Chuvash", "co": "Corsican", "hr": "Croatian", "cs": "Czech", "da": "Danish", "dv": "Dhivehi", "doi": "Dogri", "nl": "Dutch", "en": "English", "en-US": "English (US)", "en-GB": "English (UK)", "eo": "Esperanto", "et": "Estonian", "ee": "Ewe", "tl": "Filipino", "fi": "Finnish", "fr": "French", "fy": "Frisian", "gl": "Galician", "ka": "Georgian", "de": "German", "el": "Greek", "gn": "Guarani", "gu": "Gujarati", "ht": "Haitian Creole", "ha": "Hausa", "haw": "Hawaiian", "iw": "Hebrew", "hi": "Hindi", "hmn": "Hmong", "hu": "Hungarian", "is": "Icelandic", "ig": "Igbo", "ilo": "Ilocano", "id": "Indonesian", "ga": "Irish", "it": "Italian", "ja": "Japanese", "jw": "Javanese", "kn": "Kannada", "kk": "Kazakh", "km": "Khmer", "rw": "Kinyarwanda", "gom": "Konkani", "ko": "Korean", "kri": "Krio", "ku": "Kurdish (Kurmanji)", "ckb": "Kurdish (Sorani)", "ky": "Kyrgyz", "lo": "Lao", "la": "Latin", "lv": "Latvian", "ln": "Lingala", "lt": "Lithuanian", "lg": "Luganda", "lb": "Luxembourgish", "mk": "Macedonian", "mai": "Maithili", "mg": "Malagasy", "ms": "Malay", "ml": "Malayalam", "mt": "Maltese", "mi": "Maori", "mr": "Marathi", "mni": "Meiteilon (Manipuri)", "lus": "Mizo", "mn": "Mongolian", "my": "Myanmar (Burmese)", "ne": "Nepali", "no": "Norwegian", "or": "Odia (Oriya)", "om": "Oromo", "os": "Ossetian", "ps": "Pashto", "fa": "Persian", "pl": "Polish", "pt": "Portuguese", "pa": "Punjabi", "qu": "Quechua", "ro": "Romanian", "ru": "Russian", "sm": "Samoan", "sa": "Sanskrit", "gd": "Scots Gaelic", "nso": "Sepedi", "sr": "Serbian", "st": "Sesotho", "sn": "Shona", "sd": "Sindhi", "si": "Sinhala", "sk": "Slovak", "sl": "Slovenian", "so": "Somali", "es": "Spanish", "su": "Sundanese", "sw": "Swahili", "sv": "Swedish", "tg": "Tajik", "ta": "Tamil", "tt": "Tatar", "te": "Telugu", "th": "Thai", "ti": "Tigrinya", "ts": "Tsonga", "tr": "Turkish", "tk": "Turkmen", "ak": "Twi (Akan)", "uk": "Ukrainian", "ur": "Urdu", "ug": "Uyghur", "uz": "Uzbek", "vi": "Vietnamese", "cy": "Welsh", "xh": "Xhosa", "sah": "Yakut", "yi": "Yiddish", "yo": "Yoruba", "zu": "Zulu"
    };

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedTranslate = debounce(() => {
        if (currentMode === 'text') translateText();
    }, 500);

    // ============ TEXT INPUT ============
    sourceText.addEventListener('input', () => {
        let text = sourceText.value;
        if (text.length > MAX_CHARS) {
            sourceText.value = text.substring(0, MAX_CHARS);
            text = sourceText.value;
        }
        charCount.textContent = text.length;
        if (text.trim()) debouncedTranslate();
        else {
            targetText.value = '';
            document.getElementById('dictionaryContainer').classList.add('hidden');
        }
    });

    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        targetText.value = '';
        charCount.textContent = '0';
        sourceText.focus();
        document.getElementById('dictionaryContainer').classList.add('hidden');
    });

    // ============ DROPDOWNS ============
    const setupDropdown = (dropdown, defaultLang, isSource = false) => {
        const header = dropdown.querySelector('.dropdown-header');
        const selectedSpan = dropdown.querySelector('.selected-lang');
        const list = dropdown.querySelector('.dropdown-list');

        if (isSource) {
            const li = document.createElement('li');
            li.setAttribute('data-value', 'auto');
            li.textContent = 'Auto Detect';
            if (defaultLang === 'auto') {
                li.classList.add('active');
                selectedSpan.textContent = 'Auto Detect';
                selectedSpan.setAttribute('data-value', 'auto');
            }
            list.appendChild(li);
        }

        for (const [code, name] of Object.entries(LANGUAGES)) {
            const li = document.createElement('li');
            li.setAttribute('data-value', code);
            li.textContent = name;
            if (code === defaultLang) {
                li.classList.add('active');
                selectedSpan.textContent = name;
                selectedSpan.setAttribute('data-value', code);
            }
            list.appendChild(li);
        }

        const items = dropdown.querySelectorAll('.dropdown-list li');

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });

        items.forEach(item => {
            item.addEventListener('click', () => {
                selectedSpan.textContent = item.textContent;
                selectedSpan.setAttribute('data-value', item.getAttribute('data-value'));
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                dropdown.classList.remove('open');
                if (sourceText.value.trim()) translateText();
            });
        });
    };

    setupDropdown(sourceDropdown, 'auto', true);
    setupDropdown(targetDropdown, 'ru', false);

    document.getElementById('supportedCount').textContent = `Supports ${Object.keys(LANGUAGES).length} languages`;

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
    });

    const getSourceLang = () => sourceDropdown.querySelector('.selected-lang').getAttribute('data-value');
    const getTargetLang = () => targetDropdown.querySelector('.selected-lang').getAttribute('data-value');

    const setDropdownValue = (dropdown, value) => {
        const selectedSpan = dropdown.querySelector('.selected-lang');
        const items = dropdown.querySelectorAll('.dropdown-list li');
        const targetItem = Array.from(items).find(i => i.getAttribute('data-value') === value);
        if (targetItem) {
            selectedSpan.classList.add('fade');
            setTimeout(() => {
                selectedSpan.textContent = targetItem.textContent;
                selectedSpan.setAttribute('data-value', value);
                items.forEach(i => i.classList.remove('active'));
                targetItem.classList.add('active');
                setTimeout(() => selectedSpan.classList.remove('fade'), 300);
            }, 150);
        }
    };

    // ============ SWAP BUTTON ============
    swapBtn.addEventListener('click', () => {
        const sourceSpan = sourceDropdown.querySelector('.selected-lang');
        const targetSpan = targetDropdown.querySelector('.selected-lang');

        swapBtn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        swapBtn.style.transform = 'rotate(180deg)';
        swapBtn.addEventListener('transitionend', function handler() {
            swapBtn.style.transition = 'none';
            swapBtn.style.transform = 'rotate(0deg)';
            swapBtn.removeEventListener('transitionend', handler);
        });

        sourceSpan.classList.add('fade');
        targetSpan.classList.add('fade');
        sourceText.style.opacity = '0.7';
        targetText.style.opacity = '0.7';

        setTimeout(() => {
            const tempSourceVal = getSourceLang();
            const tempTargetVal = getTargetLang();

            if (tempSourceVal === 'auto') {
                setDropdownValue(sourceDropdown, tempTargetVal);
                setDropdownValue(targetDropdown, 'en-US');
            } else {
                setDropdownValue(sourceDropdown, tempTargetVal);
                setDropdownValue(targetDropdown, tempSourceVal);
            }

            const tempText = sourceText.value;
            sourceText.value = targetText.value;
            targetText.value = tempText;

            setTimeout(() => {
                sourceText.style.opacity = '1';
                targetText.style.opacity = '1';
            }, 200);

            charCount.textContent = sourceText.value.length;
            sourceSpan.classList.remove('fade');
            targetSpan.classList.remove('fade');
            if (sourceText.value.trim()) translateText();
        }, 200);
    });

    sourceText.placeholder = 'Enter text...';

    // ============ COPY / SPEAK ============
    copyBtn.addEventListener('click', async () => {
        if (!targetText.value) return;
        try {
            await navigator.clipboard.writeText(targetText.value);
            copyFeedback.classList.add('show');
            setTimeout(() => copyFeedback.classList.remove('show'), 2000);
        } catch (err) { console.error(err); }
    });

    const speak = (text, lang, btn) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { 'iw': 'he', 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant' };
        utterance.lang = langMap[lang] || lang;
        btn.classList.add('speaking');
        utterance.onend = () => btn.classList.remove('speaking');
        utterance.onerror = () => btn.classList.remove('speaking');
        window.speechSynthesis.speak(utterance);
    };

    listenSourceBtn.addEventListener('click', () => {
        const text = sourceText.value.trim();
        if (text) speak(text, getSourceLang(), listenSourceBtn);
    });
    listenTargetBtn.addEventListener('click', () => {
        const text = targetText.value.trim();
        if (text) speak(text, getTargetLang(), listenTargetBtn);
    });

    // ============ TABS ============
    function switchTab(tabName) {
        if (currentMode === tabName) return;
        const direction = getDirection(currentMode, tabName);
        const oldContent = document.querySelector(`#${currentMode}Tab`);
        const newContent = document.querySelector(`#${tabName}Tab`);
        if (!oldContent || !newContent) return;

        const translateOut = direction === 'left' ? '-30px' : '30px';
        const translateIn = direction === 'left' ? '30px' : '-30px';

        oldContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        oldContent.style.opacity = '0';
        oldContent.style.transform = `translateX(${translateOut})`;

        setTimeout(() => {
            oldContent.classList.remove('active');
            oldContent.style.display = 'none';
            newContent.style.display = 'block';
            newContent.style.transition = 'none';
            newContent.style.opacity = '0';
            newContent.style.transform = `translateX(${translateIn})`;
            void newContent.offsetWidth;
            newContent.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            newContent.style.opacity = '1';
            newContent.style.transform = 'translateX(0)';
            newContent.classList.add('active');
        }, 300);

        tabBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        currentMode = tabName;
    }

    function getDirection(from, to) {
        const tabs = ['text', 'document', 'image'];
        return tabs.indexOf(to) > tabs.indexOf(from) ? 'left' : 'right';
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    const tabsContainer = document.getElementById('tabsContainer');
    let isDown = false, startX, scrollLeft;
    tabsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        tabsContainer.style.cursor = 'grabbing';
        startX = e.pageX - tabsContainer.offsetLeft;
        scrollLeft = tabsContainer.scrollLeft;
    });
    tabsContainer.addEventListener('mouseleave', () => { isDown = false; tabsContainer.style.cursor = 'grab'; });
    tabsContainer.addEventListener('mouseup', () => { isDown = false; tabsContainer.style.cursor = 'grab'; });
    tabsContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - tabsContainer.offsetLeft;
        const walk = (x - startX) * 2;
        tabsContainer.scrollLeft = scrollLeft - walk;
    });
    tabsContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; scrollLeft = tabsContainer.scrollLeft; });
    tabsContainer.addEventListener('touchmove', (e) => {
        const x = e.touches[0].clientX;
        const walk = (x - startX) * 2;
        tabsContainer.scrollLeft = scrollLeft - walk;
    });

    // ============ FILE SELECT ============
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFileSelect(e.target.files[0]);
    });
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]);
    });

    removeFileBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        uploadPlaceholder.classList.remove('hidden');
        fileInfo.classList.add('hidden');
        translationProgress.classList.add('hidden');
        downloadArea.classList.add('hidden');
        if (currentObjectURL) { URL.revokeObjectURL(currentObjectURL); currentObjectURL = null; }
    });

    const handleFileSelect = (file) => {
        const validTypes = ['.txt', '.md', '.csv', '.json', '.pdf', '.html', '.xml', '.srt'];
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!validTypes.includes(ext)) {
            alert('Please upload a valid file (.txt, .md, .csv, .json, .pdf, .html, .xml, .srt)');
            return;
        }
        currentFile = file;
        fileNameDisplay.textContent = file.name;
        uploadPlaceholder.classList.add('hidden');
        fileInfo.classList.remove('hidden');
        translationProgress.classList.add('hidden');
        downloadArea.classList.add('hidden');
        translateDocument();
    };

    // ============ IMAGE SELECT ============
    imageBrowseBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleImageSelect(e.target.files[0]);
    });
    imageDropZone.addEventListener('dragover', (e) => { e.preventDefault(); imageDropZone.classList.add('dragover'); });
    imageDropZone.addEventListener('dragleave', () => imageDropZone.classList.remove('dragover'));
    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleImageSelect(e.dataTransfer.files[0]);
    });

    removeImageBtn.addEventListener('click', () => {
        currentImageFile = null;
        imageInput.value = '';
        imageUploadPlaceholder.classList.remove('hidden');
        imageFileInfo.classList.add('hidden');
        imageProgress.classList.add('hidden');
        imageResultContainer.classList.add('hidden');
        imagePreview.src = '';
        translatedImageText.textContent = '';
        const downloadImageBtn = document.getElementById('downloadImageBtn');
        if (downloadImageBtn) downloadImageBtn.style.display = 'none';
    });

    const handleImageSelect = (file) => {
        const validTypes = ['.png', '.jpg', '.jpeg'];
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!validTypes.includes(ext)) {
            alert('Please upload a valid image file (.png, .jpg, .jpeg)');
            return;
        }
        currentImageFile = file;
        imageFileName.textContent = file.name;
        imageUploadPlaceholder.classList.add('hidden');
        imageFileInfo.classList.remove('hidden');
        imageResultContainer.classList.add('hidden');
        imageProgress.classList.add('hidden');

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            translateImage();
        };
        reader.readAsDataURL(file);
    };

    // ============ TEXT TRANSLATION ============
    const translateText = async () => {
        const text = sourceText.value.trim();
        if (!text) {
            document.getElementById('dictionaryContainer').classList.add('hidden');
            return;
        }

        const sourceLang = getSourceLang();
        const targetLang = getTargetLang();
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=bd&q=${encodeURIComponent(text)}`;

        loadingOverlay.classList.add('active');

        try {
            const response = await fetch(url);
            const data = await response.json();
            const dictionaryContainer = document.getElementById('dictionaryContainer');

            if (data && data[0]) {
                const translatedText = data[0].map(chunk => chunk[0] || '').join('');
                targetText.value = translatedText;

                const dictHeader = document.querySelector('.dict-header');
                const dictEntries = document.getElementById('dictEntries');

                if (data[1]) {
                    let dictHTML = '';
                    let entryIndex = 1;
                    data[1].forEach(posGroup => {
                        const terms = posGroup[2];
                        if (terms) {
                            terms.forEach(termData => {
                                const term = termData[0];
                                const reverseTranslations = termData[1] || [];
                                dictHTML += `
                                <div class="dict-entry">
                                    <div class="dict-number">${entryIndex}</div>
                                    <div class="dict-content">
                                        <div class="dict-terms"><span class="dict-term">${term}</span></div>
                                        <div class="dict-reverse">${reverseTranslations.join(', ')}</div>
                                    </div>
                                </div>`;
                                entryIndex++;
                            });
                        }
                    });

                    if (dictHTML) {
                        const partOfSpeech = (data[1] && data[1][0] && data[1][0][0]) ? data[1][0][0] : '';
                        dictHeader.innerHTML = `<span class="dict-word">${text.toLowerCase()}</span> <span class="dict-pos">${partOfSpeech}</span>`;
                        dictEntries.innerHTML = dictHTML;
                        dictionaryContainer.classList.remove('hidden');
                    } else dictionaryContainer.classList.add('hidden');
                } else dictionaryContainer.classList.add('hidden');
            } else {
                targetText.value = "Error translating text. Please try again later.";
                if (dictionaryContainer) dictionaryContainer.classList.add('hidden');
            }
        } catch (error) {
            console.error('Translation error:', error);
            targetText.value = "Network error. Try a smaller text.";
        } finally {
            loadingOverlay.classList.remove('active');
        }
    };

    // ============ SHARED IMAGE PROCESSING HELPER ============
    // Принимает data URL, делает OCR + перевод + наложение. Возвращает { originalSrc, translatedSrc, translatedText }
    async function processImageForTranslation(sourceDataUrl, sourceLang, targetLang, onProgress) {
        // 1. Препроцессинг: grayscale + Otsu → бинарная маска для Tesseract
        const bwDataUrl = await new Promise((resolve, reject) => {
            const srcImg = new Image();
            srcImg.onload = () => {
                const w = srcImg.naturalWidth;
                const h = srcImg.naturalHeight;
                const cvs = document.createElement('canvas');
                cvs.width = w; cvs.height = h;
                const c = cvs.getContext('2d');
                c.drawImage(srcImg, 0, 0);

                const imgData = c.getImageData(0, 0, w, h);
                const pix = imgData.data;

                const gray = new Uint8Array(w * h);
                for (let i = 0; i < w * h; i++) {
                    gray[i] = Math.round(0.299 * pix[i*4] + 0.587 * pix[i*4+1] + 0.114 * pix[i*4+2]);
                }

                const hist = new Int32Array(256);
                for (let i = 0; i < gray.length; i++) hist[gray[i]]++;
                const total = gray.length;
                let sum = 0;
                for (let t = 0; t < 256; t++) sum += t * hist[t];
                let sumB = 0, wB = 0, maxVar = 0, threshold = 128;
                for (let t = 0; t < 256; t++) {
                    wB += hist[t];
                    if (wB === 0) continue;
                    const wF = total - wB;
                    if (wF === 0) break;
                    sumB += t * hist[t];
                    const mB = sumB / wB;
                    const mF = (sum - sumB) / wF;
                    const varBetween = wB * wF * (mB - mF) * (mB - mF);
                    if (varBetween > maxVar) { maxVar = varBetween; threshold = t; }
                }

                for (let i = 0; i < w * h; i++) {
                    const v = gray[i] < threshold ? 0 : 255;
                    pix[i*4] = pix[i*4+1] = pix[i*4+2] = v;
                    pix[i*4+3] = 255;
                }
                c.putImageData(imgData, 0, 0);

                let blackPixels = 0;
                for (let i = 0; i < pix.length; i += 4) if (pix[i] === 0) blackPixels++;
                if (blackPixels > (total / 2)) {
                    for (let i = 0; i < pix.length; i += 4) {
                        pix[i] = 255 - pix[i];
                        pix[i+1] = 255 - pix[i+1];
                        pix[i+2] = 255 - pix[i+2];
                    }
                    c.putImageData(imgData, 0, 0);
                }
                resolve(cvs.toDataURL('image/png'));
            };
            srcImg.onerror = () => reject(new Error('Failed to load source image'));
            srcImg.src = sourceDataUrl;
        });

        // 2. Tesseract с fallback по языкам
        const tessLangMap = {
            'en': 'eng', 'en-US': 'eng', 'en-GB': 'eng',
            'ru': 'rus', 'uk': 'ukr', 'be': 'bel',
            'es': 'spa', 'fr': 'fra', 'de': 'deu', 'it': 'ita', 'pt': 'por',
            'zh-CN': 'chi_sim', 'zh-TW': 'chi_tra', 'ja': 'jpn', 'ko': 'kor',
            'ar': 'ara', 'fa': 'fas', 'tr': 'tur', 'pl': 'pol', 'nl': 'nld',
            'cs': 'ces', 'sv': 'swe', 'da': 'dan', 'fi': 'fin', 'no': 'nor',
            'el': 'ell', 'he': 'heb', 'hi': 'hin', 'th': 'tha', 'vi': 'vie'
        };

        let primaryLang;
        if (sourceLang === 'auto' || sourceLang === 'ru') primaryLang = 'rus';
        else if (sourceLang.startsWith('en')) primaryLang = 'eng';
        else primaryLang = tessLangMap[sourceLang] || 'eng';

        const langsToTry = [primaryLang, 'eng', 'rus'].filter((v, i, a) => a.indexOf(v) === i);

        let result = null;
        let lastErr = null;
        for (const lang of langsToTry) {
            try {
                if (onProgress) onProgress(`Scanning (${lang})...`);
                result = await Tesseract.recognize(bwDataUrl, lang, {
                    logger: m => {
                        if (m.status === 'recognizing text' && onProgress) {
                            onProgress(`Scanning (${lang})... ${Math.round(m.progress * 100)}%`, Math.round(m.progress * 100));
                        }
                    }
                });
                console.log(`OCR success with lang: ${lang}`);
                break;
            } catch (err) {
                console.warn(`OCR failed with lang "${lang}":`, err);
                lastErr = err;
            }
        }
        if (!result) {
            throw new Error('OCR failed for all languages. Last error: ' + (lastErr ? lastErr.message : 'unknown'));
        }

        const words = result.data && result.data.words;
        if (!words || words.length === 0) {
            throw new Error('No text detected in image.');
        }

        // 3. Построение BW canvas для анализа пикселей
        const bwImg = new Image();
        bwImg.src = bwDataUrl;
        await new Promise((res, rej) => { bwImg.onload = res; bwImg.onerror = rej; });
        const bwCanvas = document.createElement('canvas');
        bwCanvas.width = bwImg.naturalWidth;
        bwCanvas.height = bwImg.naturalHeight;
        const bwCtx = bwCanvas.getContext('2d');
        bwCtx.drawImage(bwImg, 0, 0);
        const bwImageData = bwCtx.getImageData(0, 0, bwCanvas.width, bwCanvas.height);

        const img = new Image();
        img.src = sourceDataUrl;
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        const canvas = document.createElement('canvas');
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const originalImageData = ctx.getImageData(0, 0, naturalWidth, naturalHeight);

        // 4. Фильтрация слов
        const validWords = [];
        words.forEach(word => {
            const text = word.text.trim();
            if (text.length === 0) return;
            if (/^[\W_]+$/u.test(text)) return;
            const letterCount = (text.match(/\p{L}/gu) || []).length;
            const digitCount = (text.match(/\d/g) || []).length;
            if (letterCount < 1 && digitCount < 1) return;
            const conf = word.confidence || 0;
            if (conf < 25) return;
            const { x0, y0, x1, y1 } = word.bbox;
            const bw = Math.max(x1 - x0, 1);
            const bh = Math.max(y1 - y0, 1);
            if (bh < 5 || bw < 5) return;

            const bwPixels = bwCtx.getImageData(
                Math.max(x0, 0), Math.max(y0, 0),
                Math.min(bw, bwCanvas.width - x0),
                Math.min(bh, bwCanvas.height - y0)
            ).data;
            let blackCount = 0;
            for (let i = 0; i < bwPixels.length; i += 4) if (bwPixels[i] < 128) blackCount++;
            const blackRatio = blackCount / (bw * bh);
            if (blackRatio > 0.95) return;

            validWords.push({ text, bbox: word.bbox });
        });

        if (validWords.length === 0) {
            throw new Error('Readable text not found.');
        }

        // 5. Перевод через Google
        const textToTranslate = validWords.map(v => v.text).join('\n');
        const transUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
        const transResp = await fetch(transUrl);
        const transData = await transResp.json();
        let fullTranslatedText = textToTranslate;
        if (transData && transData[0]) {
            fullTranslatedText = transData[0].map(c => c[0] || '').join('');
            const translatedArr = fullTranslatedText.split('\n').map(l => l.trim());
            validWords.forEach((item, i) => {
                item.translatedText = translatedArr[i] || item.text;
            });
        } else {
            validWords.forEach(item => { item.translatedText = item.text; });
        }

        // 6. Вспомогательные функции
        const getAverageTextColor = (imgData, maskData, xStart, yStart, xEnd, yEnd, natW, natH) => {
            let sumR = 0, sumG = 0, sumB = 0, count = 0;
            for (let py = Math.max(0, Math.floor(yStart)); py < Math.min(natH, Math.ceil(yEnd)); py++) {
                for (let px = Math.max(0, Math.floor(xStart)); px < Math.min(natW, Math.ceil(xEnd)); px++) {
                    const idx = (py * natW + px) * 4;
                    if (maskData.data[idx] < 128) {
                        sumR += imgData.data[idx];
                        sumG += imgData.data[idx+1];
                        sumB += imgData.data[idx+2];
                        count++;
                    }
                }
            }
            if (count === 0) return null;
            return `rgb(${Math.round(sumR/count)}, ${Math.round(sumG/count)}, ${Math.round(sumB/count)})`;
        };

        const matchFontWeight = (fillRatio) => {
            if (fillRatio > 0.38) return 900;
            if (fillRatio > 0.34) return 800;
            if (fillRatio > 0.30) return 700;
            if (fillRatio > 0.26) return 600;
            if (fillRatio > 0.22) return 500;
            return 400;
        };

        const clearTextBackground = (x0, y0, x1, y1) => {
            const erasePad = 2;
            const ex0 = Math.max(0, Math.floor(x0) - erasePad);
            const ey0 = Math.max(0, Math.floor(y0) - erasePad);
            const ex1 = Math.min(naturalWidth, Math.ceil(x1) + erasePad);
            const ey1 = Math.min(naturalHeight, Math.ceil(y1) + erasePad);
            const regionWidth = ex1 - ex0;
            const regionHeight = ey1 - ey0;
            if (regionWidth <= 0 || regionHeight <= 0) return [0,0,0];

            const regionImageData = ctx.getImageData(ex0, ey0, regionWidth, regionHeight);
            const regionData = regionImageData.data;

            function sampleCornerColor(cx, cy, radius = 3) {
                let r = 0, g = 0, b = 0, count = 0;
                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        const sx = cx + dx, sy = cy + dy;
                        if (sx < ex0 || sx >= ex1 || sy < ey0 || sy >= ey1) continue;
                        const idx = (sy * naturalWidth + sx) * 4;
                        if (bwImageData.data[idx] < 128) continue;
                        r += originalImageData.data[idx];
                        g += originalImageData.data[idx+1];
                        b += originalImageData.data[idx+2];
                        count++;
                    }
                }
                return count > 0 ? [Math.round(r/count), Math.round(g/count), Math.round(b/count)] : null;
            }

            const tl = sampleCornerColor(ex0, ey0) || [0,0,0];
            const tr = sampleCornerColor(ex1-1, ey0) || [0,0,0];
            const bl = sampleCornerColor(ex0, ey1-1) || [0,0,0];
            const br = sampleCornerColor(ex1-1, ey1-1) || [0,0,0];

            const w1 = regionWidth > 1 ? regionWidth - 1 : 1;
            const h1 = regionHeight > 1 ? regionHeight - 1 : 1;

            for (let y = 0; y < regionHeight; y++) {
                const py = ey0 + y;
                const fy = y / h1;
                for (let x = 0; x < regionWidth; x++) {
                    const px = ex0 + x;
                    const fx = x / w1;
                    const r = Math.round((1-fx)*(1-fy)*tl[0] + fx*(1-fy)*tr[0] + (1-fx)*fy*bl[0] + fx*fy*br[0]);
                    const g = Math.round((1-fx)*(1-fy)*tl[1] + fx*(1-fy)*tr[1] + (1-fx)*fy*bl[1] + fx*fy*br[1]);
                    const b = Math.round((1-fx)*(1-fy)*tl[2] + fx*(1-fy)*tr[2] + (1-fx)*fy*bl[2] + fx*fy*br[2]);

                    let shouldErase = false;
                    const minX = Math.max(ex0, px - erasePad);
                    const maxX = Math.min(ex1 - 1, px + erasePad);
                    const minY = Math.max(ey0, py - erasePad);
                    const maxY = Math.min(ey1 - 1, py + erasePad);
                    for (let cy = minY; cy <= maxY && !shouldErase; cy++) {
                        for (let cx = minX; cx <= maxX && !shouldErase; cx++) {
                            const maskIdx = (cy * naturalWidth + cx) * 4;
                            if (bwImageData.data[maskIdx] < 128) shouldErase = true;
                        }
                    }
                    if (shouldErase) {
                        const idx = (y * regionWidth + x) * 4;
                        regionData[idx] = r;
                        regionData[idx+1] = g;
                        regionData[idx+2] = b;
                        regionData[idx+3] = 255;
                    }
                }
            }
            ctx.putImageData(regionImageData, ex0, ey0);
            return tl;
        };

        // 7. Отрисовка
        validWords.forEach((item) => {
            const { x0, y0, x1, y1 } = item.bbox;
            const boxWidth = x1 - x0;
            const boxHeight = y1 - y0;
            const cornerColor = clearTextBackground(x0, y0, x1, y1);

            const startY = Math.max(0, Math.floor(y0));
            const endY = Math.min(naturalHeight, Math.ceil(y1));
            let topTextRow = null, bottomTextRow = null;
            for (let py = startY; py < endY; py++) {
                let rowHasText = false;
                for (let px = Math.max(0, Math.floor(x0)); px < Math.min(naturalWidth, Math.ceil(x1)); px++) {
                    if (bwImageData.data[(py * naturalWidth + px) * 4] < 128) { rowHasText = true; break; }
                }
                if (rowHasText) {
                    if (topTextRow === null) topTextRow = py;
                    bottomTextRow = py;
                }
            }
            const realTextHeight = (topTextRow !== null && bottomTextRow !== null) ? (bottomTextRow - topTextRow + 1) : boxHeight;

            let textPixels = 0, totalPixels = 0;
            for (let py = startY; py < endY; py++) {
                for (let px = Math.floor(x0); px < Math.ceil(x1); px++) {
                    if (px < 0 || px >= naturalWidth || py < 0 || py >= naturalHeight) continue;
                    if (bwImageData.data[(py * naturalWidth + px) * 4] < 128) textPixels++;
                    totalPixels++;
                }
            }
            const textFillRatio = totalPixels > 0 ? textPixels / totalPixels : 0;
            const fontWeight = matchFontWeight(textFillRatio);

            let fontSize = Math.max(Math.floor(realTextHeight), 8);
            ctx.font = `${fontWeight} ${fontSize}px Arial`;
            let textWidth = ctx.measureText(item.translatedText).width;
            while (textWidth > boxWidth - 2 && fontSize > 6) {
                fontSize--;
                ctx.font = `${fontWeight} ${fontSize}px Arial`;
                textWidth = ctx.measureText(item.translatedText).width;
            }

            const leftPartWidth = Math.min(boxWidth * 0.25, 10);
            const rightPartWidth = leftPartWidth;
            const leftColor = getAverageTextColor(originalImageData, bwImageData, x0, y0, x0 + leftPartWidth, y1, naturalWidth, naturalHeight);
            const rightColor = getAverageTextColor(originalImageData, bwImageData, x1 - rightPartWidth, y0, x1, y1, naturalWidth, naturalHeight);
            const colorLeft = leftColor || rightColor || '#000000';
            const colorRight = rightColor || leftColor || '#000000';

            const gradient = ctx.createLinearGradient(x0, y0, x1, y0);
            gradient.addColorStop(0, colorLeft);
            gradient.addColorStop(1, colorRight);
            ctx.fillStyle = gradient;

            const [bgR, bgG, bgB] = cornerColor || [128,128,128];
            const bgLum = (0.299 * bgR + 0.587 * bgG + 0.114 * bgB) / 255;
            let shadowColor;
            if (bgLum > 0.6) shadowColor = 'rgba(0, 0, 0, 0.25)';
            else if (bgLum > 0.3) shadowColor = 'rgba(0, 0, 0, 0.18)';
            else shadowColor = 'rgba(255, 255, 255, 0.25)';

            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = Math.max(1, Math.round(fontSize * 0.12));
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.textBaseline = 'middle';
            ctx.fillText(item.translatedText, x0 + 1, y0 + boxHeight / 2, boxWidth - 2);

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        });

        return {
            originalSrc: sourceDataUrl,
            translatedSrc: canvas.toDataURL('image/png'),
            translatedText: fullTranslatedText
        };
    }

    // ============ IMAGE TRANSLATION ============
    const translateImage = async () => {
        if (!currentImageFile) return;

        imageProgress.classList.remove('hidden');
        overlayLayer.innerHTML = '';
        imageProgressFill.style.width = '0%';
        imageProgressText.textContent = 'Scanning image...';

        try {
            const result = await processImageForTranslation(
                imagePreview.src,
                getSourceLang(),
                getTargetLang(),
                (msg, pct) => {
                    imageProgressText.textContent = msg;
                    if (typeof pct === 'number') imageProgressFill.style.width = `${pct}%`;
                }
            );

            translatedImageText.textContent = result.translatedText;
            imagePreview.dataset.originalSrc = result.originalSrc;
            imagePreview.dataset.translatedSrc = result.translatedSrc;

            const downloadImageBtn = document.getElementById('downloadImageBtn');
            if (downloadImageBtn) {
                downloadImageBtn.style.display = 'inline-flex';
                downloadImageBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `translated_image_${getTargetLang()}.png`;
                    link.href = imagePreview.dataset.translatedSrc;
                    link.click();
                };
            }

            imageProgress.classList.add('hidden');
            imageResultContainer.classList.remove('hidden');
            imagePreview.src = imagePreview.dataset.translatedSrc;
            if (overlayLayer) overlayLayer.classList.add('hidden');
            viewTranslatedBtn.classList.add('active');
            viewOriginalBtn.classList.remove('active');
        } catch (error) {
            console.error('Image Error:', error);
            alert('Error processing image translation: ' + error.message);
            imageProgress.classList.add('hidden');
        }
    };

    // ============ DOCUMENT TRANSLATION ============
    const translateDocument = async () => {
        if (!currentFile) {
            alert('Please select a file to translate.');
            return;
        }

        const sourceLang = getSourceLang();
        const targetLang = getTargetLang();

        translationProgress.classList.remove('hidden');
        downloadArea.classList.add('hidden');
        progressFill.style.width = '0%';
        progressText.textContent = 'Reading file...';

        // === PDF: рендерим каждую страницу как изображение, переводим через OCR + overlay ===
        if (currentFile.name.toLowerCase().endsWith('.pdf')) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const totalPages = pdf.numPages;
                    const translatedPages = []; // data URLs

                    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const viewport = page.getViewport({ scale: 2 });
                        const cvs = document.createElement('canvas');
                        cvs.width = viewport.width;
                        cvs.height = viewport.height;
                        const pageCtx = cvs.getContext('2d');
                        await page.render({ canvasContext: pageCtx, viewport }).promise;
                        const pageDataUrl = cvs.toDataURL('image/png');

                        progressText.textContent = `Page ${pageNum}/${totalPages}: OCR + translation...`;

                        try {
                            const result = await processImageForTranslation(
                                pageDataUrl,
                                sourceLang,
                                targetLang,
                                (msg, pct) => {
                                    const base = Math.round(((pageNum - 1) / totalPages) * 100);
                                    const sub = Math.round(((pct || 0) / 100) * (100 / totalPages));
                                    progressFill.style.width = `${base + sub}%`;
                                    progressText.textContent = `Page ${pageNum}/${totalPages}: ${msg}`;
                                }
                            );
                            translatedPages.push(result.translatedSrc);
                        } catch (err) {
                            console.warn(`Page ${pageNum} OCR failed, using original:`, err);
                            translatedPages.push(pageDataUrl); // fallback: original page
                        }

                        progressFill.style.width = `${Math.round((pageNum / totalPages) * 100)}%`;
                    }

                    // Сборка HTML со всеми переведёнными страницами
                    const pagesHtml = translatedPages.map((src, i) =>
                        `<div class="page"><img src="${src}" alt="Page ${i+1}"/></div>`
                    ).join('\n');

                    const htmlContent = `<!DOCTYPE html>
<html lang="${targetLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Translated Document</title>
<style>
  body { background: #e5e5e5; margin: 0; padding: 20px 0; }
  .page { max-width: 900px; margin: 0 auto 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: #fff; }
  .page img { display: block; width: 100%; height: auto; }
</style>
</head>
<body>
${pagesHtml}
</body>
</html>`;

                    if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
                    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                    currentObjectURL = URL.createObjectURL(blob);

                    const lastDot = currentFile.name.lastIndexOf('.');
                    const name = currentFile.name.substring(0, lastDot) || currentFile.name;
                    downloadBtn.href = currentObjectURL;
                    downloadBtn.download = `${name}_${targetLang}.html`;

                    progressFill.style.width = '100%';
                    translationProgress.classList.add('hidden');
                    downloadArea.classList.remove('hidden');
                } catch (error) {
                    console.error('Error processing PDF:', error);
                    alert('Failed to process PDF: ' + error.message);
                    translationProgress.classList.add('hidden');
                }
            };
            reader.onerror = () => { alert('Failed to read file'); translationProgress.classList.add('hidden'); };
            reader.readAsArrayBuffer(currentFile);
            return;
        }

        // === Остальные файлы (txt, md, json, html и т.д.) — текст извлекается и переводится ===
        const processTextAndTranslate = async (text) => {
            if (!text.trim()) {
                alert('File is empty or could not extract text.');
                translationProgress.classList.add('hidden');
                return;
            }

            const chunkSize = 2000;
            const chunks = [];
            let i = 0;
            while (i < text.length) {
                let end = i + chunkSize;
                if (end < text.length) {
                    const slice = text.slice(i, end);
                    let splitFound = false;
                    for (let char of ['\n', '. ', '? ', '! ']) {
                        const idx = slice.lastIndexOf(char);
                        if (idx !== -1 && idx > slice.length * 0.5) {
                            end = i + idx + char.length;
                            splitFound = true;
                            break;
                        }
                    }
                    if (!splitFound) {
                        const lastSpace = slice.lastIndexOf(' ');
                        if (lastSpace !== -1 && lastSpace > slice.length * 0.5) end = i + lastSpace + 1;
                    }
                }
                chunks.push(text.slice(i, end));
                i = end;
            }

            progressText.textContent = `Translating ${chunks.length} chunks...`;
            const translatedChunks = new Array(chunks.length);
            let completedChunks = 0;

            const translateChunk = async (chunk, index) => {
                try {
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data && data[0]) translatedChunks[index] = data[0].map(c => c[0] || '').join('');
                    else translatedChunks[index] = chunk;
                } catch (err) { translatedChunks[index] = chunk; }
                finally {
                    completedChunks++;
                    const percent = Math.round((completedChunks / chunks.length) * 100);
                    progressFill.style.width = `${percent}%`;
                    progressText.textContent = `Translating... ${percent}% (${completedChunks}/${chunks.length})`;
                }
            };

            const batchSize = 5;
            for (let j = 0; j < chunks.length; j += batchSize) {
                const batch = chunks.slice(j, j + batchSize).map((chunk, idx) => translateChunk(chunk, j + idx));
                await Promise.all(batch);
            }

            const translatedContent = translatedChunks.join('');
            if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);

            const lastDot = currentFile.name.lastIndexOf('.');
            const name = currentFile.name.substring(0, lastDot) || currentFile.name;
            const ext = lastDot !== -1 ? currentFile.name.substring(lastDot) : '.txt';

            const blob = new Blob([translatedContent], { type: 'text/plain;charset=utf-8' });
            currentObjectURL = URL.createObjectURL(blob);
            downloadBtn.href = currentObjectURL;
            downloadBtn.download = `${name}_${targetLang}${ext}`;

            translationProgress.classList.add('hidden');
            downloadArea.classList.remove('hidden');
        };

        const reader = new FileReader();
        reader.onload = async (e) => await processTextAndTranslate(e.target.result);
        reader.onerror = () => { alert('Failed to read file'); translationProgress.classList.add('hidden'); };
        reader.readAsText(currentFile);
    };

    // ============ LUCID WATER EFFECTS (wobble) ============
    function initLucidWaterEffects() {
        const isLucidWater = document.body.getAttribute('data-theme') === 'lucid-water';
        if (!isLucidWater) return;
        document.querySelectorAll('.icon-btn, .secondary-btn, .swap-btn').forEach(btn => {
            btn.removeEventListener('mouseenter', handleMouseEnter);
            btn.addEventListener('mouseenter', handleMouseEnter);
        });
    }

    function handleMouseEnter() {
        this.style.animation = 'liquid-wobble 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        this.addEventListener('animationend', function handler() {
            this.style.animation = '';
            this.removeEventListener('animationend', handler);
        });
    }

    initLucidWaterEffects();

    // ============ VIEW TOGGLE ============
    viewOriginalBtn.addEventListener('click', () => {
        if (imagePreview.dataset.originalSrc) imagePreview.src = imagePreview.dataset.originalSrc;
        viewOriginalBtn.classList.add('active');
        viewTranslatedBtn.classList.remove('active');
    });
    viewTranslatedBtn.addEventListener('click', () => {
        if (imagePreview.dataset.translatedSrc) imagePreview.src = imagePreview.dataset.translatedSrc;
        viewTranslatedBtn.classList.add('active');
        viewOriginalBtn.classList.remove('active');
    });

    copyImageTextBtn.addEventListener('click', async () => {
        const text = translatedImageText.textContent;
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            copyImageTextBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => { copyImageTextBtn.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 2000);
        } catch (err) { console.error('Copy failed', err); }
    });

    sourceText.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (currentMode === 'text') translateText();
        }
    });
});