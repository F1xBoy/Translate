document.addEventListener('DOMContentLoaded', () => {
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

    const setupDropdown = (dropdown, defaultLang) => {
        const header = dropdown.querySelector('.dropdown-header');
        const selectedSpan = dropdown.querySelector('.selected-lang');
        const list = dropdown.querySelector('.dropdown-list');

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

    setupDropdown(sourceDropdown, 'en-US');
    setupDropdown(targetDropdown, 'ru');

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
            const t1 = getSourceLang(), t2 = getTargetLang();
            setDropdownValue(sourceDropdown, t2);
            setDropdownValue(targetDropdown, t1);
            const tmp = sourceText.value;
            sourceText.value = targetText.value;
            targetText.value = tmp;
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
        const utt = new SpeechSynthesisUtterance(text);
        const map = { 'iw': 'he', 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant' };
        utt.lang = map[lang] || lang;
        btn.classList.add('speaking');
        utt.onend = () => btn.classList.remove('speaking');
        utt.onerror = () => btn.classList.remove('speaking');
        window.speechSynthesis.speak(utt);
    };

    listenSourceBtn.addEventListener('click', () => {
        const t = sourceText.value.trim();
        if (t) speak(t, getSourceLang(), listenSourceBtn);
    });
    listenTargetBtn.addEventListener('click', () => {
        const t = targetText.value.trim();
        if (t) speak(t, getTargetLang(), listenTargetBtn);
    });

    function switchTab(tabName) {
        if (currentMode === tabName) return;
        const direction = getDirection(currentMode, tabName);
        const oldContent = document.querySelector(`#${currentMode}Tab`);
        const newContent = document.querySelector(`#${tabName}Tab`);
        if (!oldContent || !newContent) return;
        const outX = direction === 'left' ? '-30px' : '30px';
        const inX = direction === 'left' ? '30px' : '-30px';
        oldContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        oldContent.style.opacity = '0';
        oldContent.style.transform = `translateX(${outX})`;
        setTimeout(() => {
            oldContent.classList.remove('active');
            oldContent.style.display = 'none';
            newContent.style.display = 'block';
            newContent.style.transition = 'none';
            newContent.style.opacity = '0';
            newContent.style.transform = `translateX(${inX})`;
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
        tabsContainer.scrollLeft = scrollLeft - (x - startX) * 2;
    });
    tabsContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; scrollLeft = tabsContainer.scrollLeft; });
    tabsContainer.addEventListener('touchmove', (e) => {
        tabsContainer.scrollLeft = scrollLeft - (e.touches[0].clientX - startX) * 2;
    });

    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => { if (e.target.files.length > 0) handleFileSelect(e.target.files[0]); });
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault(); dropZone.classList.remove('dragover');
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
        if (!validTypes.includes(ext)) { alert('Please upload a valid file'); return; }
        currentFile = file;
        fileNameDisplay.textContent = file.name;
        uploadPlaceholder.classList.add('hidden');
        fileInfo.classList.remove('hidden');
        translationProgress.classList.add('hidden');
        downloadArea.classList.add('hidden');
        translateDocument();
    };

    imageBrowseBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => { if (e.target.files.length > 0) handleImageSelect(e.target.files[0]); });
    imageDropZone.addEventListener('dragover', (e) => { e.preventDefault(); imageDropZone.classList.add('dragover'); });
    imageDropZone.addEventListener('dragleave', () => imageDropZone.classList.remove('dragover'));
    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault(); imageDropZone.classList.remove('dragover');
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
        const d = document.getElementById('downloadImageBtn');
        if (d) d.style.display = 'none';
    });

    const handleImageSelect = (file) => {
        const validTypes = ['.png', '.jpg', '.jpeg'];
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!validTypes.includes(ext)) { alert('Please upload a valid image'); return; }
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
            const dictContainer = document.getElementById('dictionaryContainer');
            if (data && data[0]) {
                targetText.value = data[0].map(chunk => chunk[0] || '').join('');
                const dictHeader = document.querySelector('.dict-header');
                const dictEntries = document.getElementById('dictEntries');
                if (data[1]) {
                    let dictHTML = '';
                    let idx = 1;
                    data[1].forEach(posGroup => {
                        const terms = posGroup[2];
                        if (terms) {
                            terms.forEach(termData => {
                                dictHTML += `<div class="dict-entry"><div class="dict-number">${idx}</div><div class="dict-content"><div class="dict-terms"><span class="dict-term">${termData[0]}</span></div><div class="dict-reverse">${(termData[1] || []).join(', ')}</div></div></div>`;
                                idx++;
                            });
                        }
                    });
                    if (dictHTML) {
                        const pos = (data[1][0] && data[1][0][0]) ? data[1][0][0] : '';
                        dictHeader.innerHTML = `<span class="dict-word">${text.toLowerCase()}</span> <span class="dict-pos">${pos}</span>`;
                        dictEntries.innerHTML = dictHTML;
                        dictContainer.classList.remove('hidden');
                    } else dictContainer.classList.add('hidden');
                } else dictContainer.classList.add('hidden');
            }
        } catch (error) {
            console.error('Translation error:', error);
            targetText.value = "Network error.";
        } finally {
            loadingOverlay.classList.remove('active');
        }
    };

    function groupWordsIntoLines(validWords) {
        if (validWords.length === 0) return [];
        const sorted = [...validWords].sort((a, b) => {
            const dy = a.bbox.y0 - b.bbox.y0;
            if (Math.abs(dy) > 5) return dy;
            return a.bbox.x0 - b.bbox.x0;
        });
        const lines = [];
        for (const word of sorted) {
            const wordMid = (word.bbox.y0 + word.bbox.y1) / 2;
            const wordH = word.bbox.y1 - word.bbox.y0;
            let placed = false;
            for (const line of lines) {
                const lineMid = (line.bbox.y0 + line.bbox.y1) / 2;
                const lineH = line.bbox.y1 - line.bbox.y0;
                const tol = Math.min(wordH, lineH) * 0.6;
                if (Math.abs(wordMid - lineMid) < tol) {
                    const gap = Math.min(Math.abs(word.bbox.x0 - line.bbox.x1), Math.abs(word.bbox.x1 - line.bbox.x0));
                    const maxGap = Math.max(wordH, lineH) * 4;
                    if (gap <= maxGap || (word.bbox.x0 >= line.bbox.x0 && word.bbox.x1 <= line.bbox.x1)) {
                        line.words.push(word);
                        line.bbox.x0 = Math.min(line.bbox.x0, word.bbox.x0);
                        line.bbox.y0 = Math.min(line.bbox.y0, word.bbox.y0);
                        line.bbox.x1 = Math.max(line.bbox.x1, word.bbox.x1);
                        line.bbox.y1 = Math.max(line.bbox.y1, word.bbox.y1);
                        placed = true;
                        break;
                    }
                }
            }
            if (!placed) lines.push({ words: [word], bbox: { ...word.bbox } });
        }
        for (const line of lines) {
            line.words.sort((a, b) => a.bbox.x0 - b.bbox.x0);
            line.text = line.words.map(w => w.text).join(' ');
            line.avgConfidence = line.words.reduce((s, w) => s + (w.confidence || 0), 0) / line.words.length;
            line.avgBlackRatio = line.words.reduce((s, w) => s + (w.blackRatio || 0), 0) / line.words.length;
            line.avgSymbolConfidence = line.words.reduce((s, w) => s + (w.symbolConfidence || 100), 0) / line.words.length;
            line.symbolCoverage = line.words.reduce((s, w) => s + (w.symbolCoverage || 1), 0) / line.words.length;
        }
        return lines;
    }

    // ============ ЛОГО-ФИЛЬТР: посимвольная валидация ============
    // Главная идея: если OCR сам сомневается в буквах (symbols), это не текст.
    // У реальных слов буквы распознаны уверенно и покрывают bbox равномерно.
    // У логотипов confidence символов низкий, покрытие неравномерное.
    function analyzeWordSymbols(word) {
        const symbols = word.symbols || [];
        if (symbols.length === 0) {
            // Нет данных по символам — используем confidence слова
            const c = +(word.confidence || 0);
            return { symbolConfidence: c, symbolCoverage: 1, symbolCount: word.text.replace(/\s/g,'').length, hasData: false };
        }

        const confs = symbols.map(s => +s.confidence || 0);
        const avgConf = confs.reduce((a, b) => a + b, 0) / confs.length;
        const highConfCount = confs.filter(c => c > 60).length;

        // Покрытие bbox: суммарная площадь символов / площадь bbox слова
        const wordBox = word.bbox;
        const wordW = wordBox.x1 - wordBox.x0;
        const wordH = wordBox.y1 - wordBox.y0;
        const wordArea = wordW * wordH;
        let symbolsArea = 0;
        symbols.forEach(s => {
            const sb = s.bbox;
            if (!sb) return;
            symbolsArea += Math.max(0, sb.x1 - sb.x0) * Math.max(0, sb.y1 - sb.y0);
        });
        const coverage = wordArea > 0 ? Math.min(1, symbolsArea / wordArea) : 1;

        return {
            symbolConfidence: avgConf,
            highConfRatio: highConfCount / confs.length,
            symbolCoverage: coverage,
            symbolCount: symbols.length,
            hasData: true
        };
    }

    function isLikelyLogo(line, bwImageData, naturalWidth, naturalHeight) {
        const { x0, y0, x1, y1 } = line.bbox;
        const w = x1 - x0;
        const h = y1 - y0;
        const ratio = w / Math.max(h, 1);
        const letters = (line.text.match(/\p{L}/gu) || []).length;
        const digits = (line.text.match(/\d/g) || []).length;
        const totalChars = line.text.replace(/\s/g, '').length;
        const wordCount = line.words.length;

        // Быстрые геометрические фильтры
        if (line.avgBlackRatio > 0.72) return true;
        if (line.avgBlackRatio < 0.01) return true;
        if (letters + digits < 2) return true;
        if (wordCount === 1 && letters <= 1) return true;
        if (wordCount === 1 && letters <= 3 && ratio < 1.4) return true;
        if (wordCount === 1 && totalChars <= 3 && ratio > 10) return true;
        if (wordCount === 1 && letters <= 2 && ratio > 5) return true;

        // ГЛАВНАЯ ПРОВЕРКА: посимвольная валидация
        // У логотипа confidence символов низкий или покрытие неровное
        const totalSymbolConf = line.words.reduce((s, w) => {
            const a = analyzeWordSymbols(w);
            return s + (a.hasData ? a.symbolConfidence : +(w.confidence || 0));
        }, 0) / line.words.length;

        const avgCoverage = line.words.reduce((s, w) => {
            const a = analyzeWordSymbols(w);
            return s + a.symbolCoverage;
        }, 0) / line.words.length;

        // Если символы плохо распознаны (средний confidence < 55) — не текст
        if (totalSymbolConf < 55) return true;

        // Если символы плохо покрывают bbox (coverage < 0.35) — странная форма, не текст
        // У обычного текста буквы занимают 40-70% bbox
        if (avgCoverage < 0.35) return true;

        // Изолированное слово с низкой уверенностью
        if (wordCount === 1 && line.avgConfidence < 55) return true;

        return false;
    }

    // ============ МНОГОТОЧЕЧНЫЙ ГРАДИЕНТ ============
    // Собираем цвет текста в N точках по ширине bbox и строим плавный градиент.
    // Точки без данных — интерполируем между соседними.
    function buildTextGradient(line, originalImageData, bwImageData, naturalWidth, naturalHeight) {
        const { x0, y0, x1, y1 } = line.bbox;
        const w = x1 - x0;
        if (w <= 0) return '#000000';

        const NUM_POINTS = 7;
        const samples = [];

        for (let i = 0; i < NUM_POINTS; i++) {
            const startX = x0 + (i / NUM_POINTS) * w;
            const endX = x0 + ((i + 1) / NUM_POINTS) * w;

            let sR = 0, sG = 0, sB = 0, cnt = 0;
            for (let py = Math.max(0, Math.floor(y0)); py < Math.min(naturalHeight, Math.ceil(y1)); py++) {
                for (let px = Math.max(0, Math.floor(startX)); px < Math.min(naturalWidth, Math.ceil(endX)); px++) {
                    const idx = (py * naturalWidth + px) * 4;
                    if (bwImageData.data[idx] < 128) {
                        sR += originalImageData.data[idx];
                        sG += originalImageData.data[idx + 1];
                        sB += originalImageData.data[idx + 2];
                        cnt++;
                    }
                }
            }

            const pos = i / (NUM_POINTS - 1);
            if (cnt > 0) {
                samples.push({ pos, r: sR / cnt, g: sG / cnt, b: sB / cnt, valid: true });
            } else {
                samples.push({ pos, r: 0, g: 0, b: 0, valid: false });
            }
        }

        // Если совсем нет данных — чёрный
        const anyValid = samples.some(s => s.valid);
        if (!anyValid) return '#000000';

        // Интерполяция пропусков между валидными точками
        for (let i = 0; i < samples.length; i++) {
            if (samples[i].valid) continue;
            // Найти ближайший валидный слева
            let left = -1, right = -1;
            for (let j = i - 1; j >= 0; j--) if (samples[j].valid) { left = j; break; }
            for (let j = i + 1; j < samples.length; j++) if (samples[j].valid) { right = j; break; }

            if (left >= 0 && right >= 0) {
                const t = (i - left) / (right - left);
                samples[i].r = samples[left].r * (1 - t) + samples[right].r * t;
                samples[i].g = samples[left].g * (1 - t) + samples[right].g * t;
                samples[i].b = samples[left].b * (1 - t) + samples[right].b * t;
                samples[i].valid = true;
            } else if (left >= 0) {
                samples[i].r = samples[left].r;
                samples[i].g = samples[left].g;
                samples[i].b = samples[left].b;
                samples[i].valid = true;
            } else if (right >= 0) {
                samples[i].r = samples[right].r;
                samples[i].g = samples[right].g;
                samples[i].b = samples[right].b;
                samples[i].valid = true;
            }
        }

        // Если остался только 1 валидный цвет — просто используем его
        const validSamples = samples.filter(s => s.valid);
        if (validSamples.length === 0) return '#000000';

        // Проверяем разброс: если все цвета почти одинаковые, всё равно используем градиент (для совместимости)
        const grad = ctx => {
            const g = ctx.createLinearGradient(x0, y0, x1, y0);
            validSamples.forEach(s => {
                g.addColorStop(s.pos, `rgb(${Math.round(s.r)}, ${Math.round(s.g)}, ${Math.round(s.b)})`);
            });
            return g;
        };
        return grad;
    }

    // ============ INPAINT (nearest-neighbor) ============
    function makeInpaintFunction(ctx, bwImageData, naturalWidth, naturalHeight) {
        return function inpaintRegion(x0, y0, x1, y1) {
            const pad = 4;
            const ex0 = Math.max(0, Math.floor(x0) - pad);
            const ey0 = Math.max(0, Math.floor(y0) - pad);
            const ex1 = Math.min(naturalWidth, Math.ceil(x1) + pad);
            const ey1 = Math.min(naturalHeight, Math.ceil(y1) + pad);
            const rw = ex1 - ex0;
            const rh = ey1 - ey0;
            if (rw <= 0 || rh <= 0) return;

            const regionImageData = ctx.getImageData(ex0, ey0, rw, rh);
            const data = regionImageData.data;

            const mask = new Uint8Array(rw * rh);
            for (let y = 0; y < rh; y++) {
                for (let x = 0; x < rw; x++) {
                    const px = ex0 + x, py = ey0 + y;
                    if (bwImageData.data[(py * naturalWidth + px) * 4] < 128) {
                        mask[y * rw + x] = 1;
                    }
                }
            }

            const dilR = 2;
            const dilated = mask.slice();
            for (let y = 0; y < rh; y++) {
                for (let x = 0; x < rw; x++) {
                    if (!mask[y * rw + x]) continue;
                    for (let dy = -dilR; dy <= dilR; dy++) {
                        for (let dx = -dilR; dx <= dilR; dx++) {
                            const ny = y + dy, nx = x + dx;
                            if (ny < 0 || ny >= rh || nx < 0 || nx >= rw) continue;
                            dilated[ny * rw + nx] = 1;
                        }
                    }
                }
            }
            mask.set(dilated);

            const dist = new Float32Array(rw * rh);
            const srcIdx = new Int32Array(rw * rh);
            for (let i = 0; i < rw * rh; i++) {
                if (mask[i]) { dist[i] = Infinity; srcIdx[i] = -1; }
                else { dist[i] = 0; srcIdx[i] = i; }
            }
            for (let y = 0; y < rh; y++) {
                for (let x = 0; x < rw; x++) {
                    const i = y * rw + x;
                    if (!mask[i]) continue;
                    if (y > 0) { const ni = (y-1)*rw+x; const nd = dist[ni]+1; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                    if (x > 0) { const ni = y*rw+x-1; const nd = dist[ni]+1; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                    if (y > 0 && x > 0) { const ni = (y-1)*rw+x-1; const nd = dist[ni]+1.414; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                    if (y > 0 && x < rw-1) { const ni = (y-1)*rw+x+1; const nd = dist[ni]+1.414; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                }
            }
            for (let y = rh-1; y >= 0; y--) {
                for (let x = rw-1; x >= 0; x--) {
                    const i = y * rw + x;
                    if (!mask[i]) continue;
                    if (y < rh-1) { const ni = (y+1)*rw+x; const nd = dist[ni]+1; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                    if (x < rw-1) { const ni = y*rw+x+1; const nd = dist[ni]+1; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                    if (y < rh-1 && x < rw-1) { const ni = (y+1)*rw+x+1; const nd = dist[ni]+1.414; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                    if (y < rh-1 && x > 0) { const ni = (y+1)*rw+x-1; const nd = dist[ni]+1.414; if (nd < dist[i]) { dist[i]=nd; srcIdx[i]=srcIdx[ni]; } }
                }
            }
            for (let i = 0; i < rw * rh; i++) {
                if (!mask[i]) continue;
                const src = srcIdx[i];
                if (src < 0) continue;
                const sOff = src * 4;
                const dOff = i * 4;
                data[dOff] = data[sOff];
                data[dOff+1] = data[sOff+1];
                data[dOff+2] = data[sOff+2];
                data[dOff+3] = 255;
            }
            ctx.putImageData(regionImageData, ex0, ey0);
        };
    }

    async function processImageForTranslation(sourceDataUrl, sourceLang, targetLang, onProgress) {
        // 1. Бинаризация Otsu
        const bwDataUrl = await new Promise((resolve, reject) => {
            const srcImg = new Image();
            srcImg.onload = () => {
                const w = srcImg.naturalWidth, h = srcImg.naturalHeight;
                const cvs = document.createElement('canvas');
                cvs.width = w; cvs.height = h;
                const c = cvs.getContext('2d', { willReadFrequently: true });
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
                    const v = wB * wF * (mB - mF) * (mB - mF);
                    if (v > maxVar) { maxVar = v; threshold = t; }
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

        // 2. Tesseract
        const tessMap = {
            'en': 'eng', 'en-US': 'eng', 'en-GB': 'eng',
            'ru': 'rus', 'uk': 'ukr', 'be': 'bel',
            'es': 'spa', 'fr': 'fra', 'de': 'deu', 'it': 'ita', 'pt': 'por',
            'zh-CN': 'chi_sim', 'zh-TW': 'chi_tra', 'ja': 'jpn', 'ko': 'kor',
            'ar': 'ara', 'fa': 'fas', 'tr': 'tur', 'pl': 'pol', 'nl': 'nld',
            'cs': 'ces', 'sv': 'swe', 'da': 'dan', 'fi': 'fin', 'no': 'nor',
            'el': 'ell', 'he': 'heb', 'hi': 'hin', 'th': 'tha', 'vi': 'vie'
        };
        const tessLang = tessMap[sourceLang] || 'eng';
        if (onProgress) onProgress(`Scanning (${tessLang})...`, 0);

        const result = await Tesseract.recognize(bwDataUrl, tessLang, {
            logger: m => {
                if (m.status === 'recognizing text' && onProgress) {
                    onProgress(`Scanning (${tessLang})... ${Math.round(m.progress * 100)}%`, Math.round(m.progress * 100));
                }
            }
        });

        const words = result.data && result.data.words;
        if (!words || words.length === 0) throw new Error('No text detected.');

        // 3. Canvas + BW
        const bwImg = new Image();
        bwImg.src = bwDataUrl;
        await new Promise((res, rej) => { bwImg.onload = res; bwImg.onerror = rej; });
        const bwCanvas = document.createElement('canvas');
        bwCanvas.width = bwImg.naturalWidth;
        bwCanvas.height = bwImg.naturalHeight;
        const bwCtx = bwCanvas.getContext('2d', { willReadFrequently: true });
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
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const originalImageData = ctx.getImageData(0, 0, naturalWidth, naturalHeight);

        // 4. Фильтр слов
        const rawWords = [];
        words.forEach(word => {
            const text = word.text.trim();
            if (text.length === 0) return;
            if (/^[\W_]+$/u.test(text)) return;
            const letters = (text.match(/\p{L}/gu) || []).length;
            const digits = (text.match(/\d/g) || []).length;
            if (letters < 1 && digits < 1) return;
            const conf = +word.confidence || 0;
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
            if (blackRatio > 0.9) return;
            if (blackRatio < 0.005) return;

            const symAnalysis = analyzeWordSymbols(word);
            rawWords.push({
                text,
                bbox: word.bbox,
                confidence: conf,
                blackRatio,
                symbolConfidence: symAnalysis.symbolConfidence,
                symbolCoverage: symAnalysis.symbolCoverage
            });
        });

        // 5. Группировка + лого-фильтр
        let lines = groupWordsIntoLines(rawWords);
        lines = lines.filter(line => !isLikelyLogo(line, bwImageData, naturalWidth, naturalHeight));

        if (lines.length === 0) {
            throw new Error(`Readable text not found (${rawWords.length} words → 0 lines after filter).`);
        }

        // 6. Перевод строками
        if (onProgress) onProgress('Translating text...', 100);
        const joinedText = lines.map(l => l.text).join('\n');
        const transUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(joinedText)}`;
        const transResp = await fetch(transUrl);
        const transData = await transResp.json();
        let fullTranslatedText = joinedText;
        if (transData && transData[0]) {
            fullTranslatedText = transData[0].map(c => c[0] || '').join('');
            const arr = fullTranslatedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            lines.forEach((line, i) => { line.translatedText = arr[i] || line.text; });
        } else {
            lines.forEach(line => { line.translatedText = line.text; });
        }

        // 7. Inpaint + отрисовка
        const inpaintRegion = makeInpaintFunction(ctx, bwImageData, naturalWidth, naturalHeight);

        for (const line of lines) {
            const origBox = { x0: line.bbox.x0, y0: line.bbox.y0, x1: line.bbox.x1, y1: line.bbox.y1 };
            const origW = origBox.x1 - origBox.x0;
            const origH = origBox.y1 - origBox.y0;

            // Реальная высота текста в строке
            const startY = Math.max(0, Math.floor(origBox.y0));
            const endY = Math.min(naturalHeight, Math.ceil(origBox.y1));
            let topRow = null, bottomRow = null;
            for (let py = startY; py < endY; py++) {
                let has = false;
                for (let px = Math.max(0, Math.floor(origBox.x0)); px < Math.min(naturalWidth, Math.ceil(origBox.x1)); px++) {
                    if (bwImageData.data[(py * naturalWidth + px) * 4] < 128) { has = true; break; }
                }
                if (has) { if (topRow === null) topRow = py; bottomRow = py; }
            }
            const realH = (topRow !== null && bottomRow !== null) ? (bottomRow - topRow + 1) : origH;

            // Плотность для жирности
            let textPixels = 0, totalPixels = 0;
            for (let py = startY; py < endY; py++) {
                for (let px = Math.floor(origBox.x0); px < Math.ceil(origBox.x1); px++) {
                    if (px < 0 || px >= naturalWidth || py < 0 || py >= naturalHeight) continue;
                    if (bwImageData.data[(py * naturalWidth + px) * 4] < 128) textPixels++;
                    totalPixels++;
                }
            }
            const fillRatio = totalPixels > 0 ? textPixels / totalPixels : 0;
            const fontWeight = fillRatio > 0.30 ? 700 : (fillRatio > 0.22 ? 500 : 400);

            // ТОЧКА 1: подбираем размер шрифта, при котором переведённый текст влезает
            let fontSize = Math.max(Math.floor(realH * 0.95), 8);
            ctx.font = `${fontWeight} ${fontSize}px Arial, "Segoe UI", sans-serif`;
            let textWidth = ctx.measureText(line.translatedText).width;

            // Уменьшение шрифта, если не влезает
            while (textWidth > origW - 2 && fontSize > 8) {
                fontSize--;
                ctx.font = `${fontWeight} ${fontSize}px Arial, "Segoe UI", sans-serif`;
                textWidth = ctx.measureText(line.translatedText).width;
            }

            // ТОЧКА 2: определяем ФИНАЛЬНЫЙ bbox для заливки фона
            // Если текст всё ещё шире оригинала, расширяем bbox симметрично,
            // но не более чем в 2 раза от оригинала, и не выходя за границы изображения.
            let finalBox;
            if (textWidth <= origW - 2) {
                // Помещается — используем оригинальный bbox
                finalBox = { ...origBox };
            } else {
                // Расширяем по горизонтали
                const centerX = (origBox.x0 + origBox.x1) / 2;
                const neededWidth = Math.min(textWidth + 4, origW * 2);
                const halfW = neededWidth / 2;
                let nx0 = centerX - halfW;
                let nx1 = centerX + halfW;
                // Клипаем по границам изображения
                if (nx0 < 0) { nx1 += -nx0; nx0 = 0; }
                if (nx1 > naturalWidth) { nx0 -= (nx1 - naturalWidth); nx1 = naturalWidth; }
                nx0 = Math.max(0, nx0);
                finalBox = {
                    x0: nx0,
                    y0: origBox.y0,
                    x1: nx1,
                    y1: origBox.y1
                };
            }

            // ТОЧКА 3: инпейнтим ИМЕННО финальный bbox — под новым текстом
            inpaintRegion(finalBox.x0, finalBox.y0, finalBox.x1, finalBox.y1);

            // ТОЧКА 4: градиент
            const gradientOrColor = buildTextGradient(line, originalImageData, bwImageData, naturalWidth, naturalHeight);
            if (typeof gradientOrColor === 'function') {
                ctx.fillStyle = gradientOrColor(ctx);
            } else {
                ctx.fillStyle = gradientOrColor;
            }

            // ТОЧКА 5: рисуем текст в финальном bbox
            const finalW = finalBox.x1 - finalBox.x0;
            const finalH = finalBox.y1 - finalBox.y0;
            ctx.textBaseline = 'middle';
            ctx.fillText(line.translatedText, finalBox.x0 + 1, finalBox.y0 + finalH / 2, finalW - 2);
        }

        return {
            originalSrc: sourceDataUrl,
            translatedSrc: canvas.toDataURL('image/jpeg', 0.92),
            translatedText: fullTranslatedText
        };
    }

    const translateImage = async () => {
        if (!currentImageFile) return;
        imageProgress.classList.remove('hidden');
        overlayLayer.innerHTML = '';
        imageProgressFill.style.width = '0%';
        imageProgressText.textContent = 'Scanning image...';
        try {
            const result = await processImageForTranslation(
                imagePreview.src, getSourceLang(), getTargetLang(),
                (msg, pct) => {
                    imageProgressText.textContent = msg;
                    if (typeof pct === 'number') imageProgressFill.style.width = `${pct}%`;
                }
            );
            translatedImageText.textContent = result.translatedText;
            imagePreview.dataset.originalSrc = result.originalSrc;
            imagePreview.dataset.translatedSrc = result.translatedSrc;
            const dl = document.getElementById('downloadImageBtn');
            if (dl) {
                dl.style.display = 'inline-flex';
                dl.onclick = () => {
                    const a = document.createElement('a');
                    a.download = `translated_image_${getTargetLang()}.jpg`;
                    a.href = imagePreview.dataset.translatedSrc;
                    a.click();
                };
            }
            imageProgress.classList.add('hidden');
            imageResultContainer.classList.remove('hidden');
            imagePreview.src = imagePreview.dataset.translatedSrc;
            viewTranslatedBtn.classList.add('active');
            viewOriginalBtn.classList.remove('active');
        } catch (error) {
            console.error('Image Error:', error);
            alert('Error processing image translation: ' + error.message);
            imageProgress.classList.add('hidden');
        }
    };

    const translateDocument = async () => {
        if (!currentFile) { alert('Please select a file.'); return; }
        const sourceLang = getSourceLang();
        const targetLang = getTargetLang();
        translationProgress.classList.remove('hidden');
        downloadArea.classList.add('hidden');
        progressFill.style.width = '0%';
        progressText.textContent = 'Reading file...';

        if (currentFile.name.toLowerCase().endsWith('.pdf')) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    if (!window.jspdf || !window.jspdf.jsPDF) {
                        throw new Error('jsPDF library not loaded.');
                    }
                    const { jsPDF } = window.jspdf;

                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const totalPages = pdf.numPages;
                    let pdfDoc = null;

                    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const baseViewport = page.getViewport({ scale: 1 });
                        const renderViewport = page.getViewport({ scale: 1.5 });

                        const cvs = document.createElement('canvas');
                        cvs.width = renderViewport.width;
                        cvs.height = renderViewport.height;
                        const pageCtx = cvs.getContext('2d', { willReadFrequently: true });
                        await page.render({ canvasContext: pageCtx, viewport: renderViewport }).promise;
                        const pageDataUrl = cvs.toDataURL('image/jpeg', 0.9);

                        progressText.textContent = `Page ${pageNum}/${totalPages}: OCR...`;

                        let translatedSrc = pageDataUrl;
                        try {
                            const r = await processImageForTranslation(
                                pageDataUrl, sourceLang, targetLang,
                                (msg, pct) => {
                                    const base = ((pageNum - 1) / totalPages) * 100;
                                    const sub = ((pct || 0) / 100) * (100 / totalPages);
                                    progressFill.style.width = `${base + sub}%`;
                                    progressText.textContent = `Page ${pageNum}/${totalPages}: ${msg}`;
                                }
                            );
                            translatedSrc = r.translatedSrc;
                        } catch (err) {
                            console.warn(`Page ${pageNum} translation failed:`, err.message);
                        }

                        cvs.width = 0; cvs.height = 0;

                        const orient = baseViewport.width > baseViewport.height ? 'landscape' : 'portrait';
                        if (!pdfDoc) {
                            pdfDoc = new jsPDF({ unit: 'pt', format: [baseViewport.width, baseViewport.height], orientation: orient });
                        } else {
                            pdfDoc.addPage([baseViewport.width, baseViewport.height], orient);
                        }
                        pdfDoc.addImage(translatedSrc, 'JPEG', 0, 0, baseViewport.width, baseViewport.height, undefined, 'MEDIUM');

                        progressFill.style.width = `${Math.round((pageNum / totalPages) * 100)}%`;
                    }

                    if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
                    const blob = pdfDoc.output('blob');
                    currentObjectURL = URL.createObjectURL(blob);
                    const lastDot = currentFile.name.lastIndexOf('.');
                    const name = currentFile.name.substring(0, lastDot) || currentFile.name;
                    downloadBtn.href = currentObjectURL;
                    downloadBtn.download = `${name}_${targetLang}.pdf`;
                    progressFill.style.width = '100%';
                    translationProgress.classList.add('hidden');
                    downloadArea.classList.remove('hidden');
                } catch (error) {
                    console.error('PDF Error:', error);
                    alert('Failed to process PDF: ' + error.message);
                    translationProgress.classList.add('hidden');
                }
            };
            reader.onerror = () => { alert('Failed to read file'); translationProgress.classList.add('hidden'); };
            reader.readAsArrayBuffer(currentFile);
            return;
        }

        // Остальные файлы
        const processText = async (text) => {
            if (!text.trim()) { alert('File empty'); translationProgress.classList.add('hidden'); return; }
            const chunkSize = 2000;
            const chunks = [];
            let i = 0;
            while (i < text.length) {
                let end = i + chunkSize;
                if (end < text.length) {
                    const slice = text.slice(i, end);
                    for (let ch of ['\n', '. ', '? ', '! ']) {
                        const idx = slice.lastIndexOf(ch);
                        if (idx !== -1 && idx > slice.length * 0.5) { end = i + idx + ch.length; break; }
                    }
                }
                chunks.push(text.slice(i, end));
                i = end;
            }
            progressText.textContent = `Translating ${chunks.length} chunks...`;
            const tr = new Array(chunks.length);
            let done = 0;
            for (let j = 0; j < chunks.length; j += 5) {
                const batch = chunks.slice(j, j + 5).map(async (chunk, k) => {
                    try {
                        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
                        const res = await fetch(url);
                        const data = await res.json();
                        tr[j + k] = (data && data[0]) ? data[0].map(c => c[0] || '').join('') : chunk;
                    } catch { tr[j + k] = chunk; }
                    done++;
                    progressFill.style.width = `${Math.round((done / chunks.length) * 100)}%`;
                    progressText.textContent = `Translating... ${done}/${chunks.length}`;
                });
                await Promise.all(batch);
            }
            const content = tr.join('');
            if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
            const lastDot = currentFile.name.lastIndexOf('.');
            const name = currentFile.name.substring(0, lastDot) || currentFile.name;
            const ext = lastDot !== -1 ? currentFile.name.substring(lastDot) : '.txt';
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            currentObjectURL = URL.createObjectURL(blob);
            downloadBtn.href = currentObjectURL;
            downloadBtn.download = `${name}_${targetLang}${ext}`;
            translationProgress.classList.add('hidden');
            downloadArea.classList.remove('hidden');
        };

        const reader = new FileReader();
        reader.onload = async (e) => await processText(e.target.result);
        reader.onerror = () => { alert('Failed to read file'); translationProgress.classList.add('hidden'); };
        reader.readAsText(currentFile);
    };

    function initLucidWaterEffects() {
        if (document.body.getAttribute('data-theme') !== 'lucid-water') return;
        document.querySelectorAll('.icon-btn, .secondary-btn, .swap-btn').forEach(btn => {
            btn.removeEventListener('mouseenter', handleMouseEnter);
            btn.addEventListener('mouseenter', handleMouseEnter);
        });
    }
    function handleMouseEnter() {
        this.style.animation = 'liquid-wobble 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        this.addEventListener('animationend', function h() {
            this.style.animation = '';
            this.removeEventListener('animationend', h);
        });
    }
    initLucidWaterEffects();

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
        } catch (err) { console.error(err); }
    });

    sourceText.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (currentMode === 'text') translateText();
        }
    });
});