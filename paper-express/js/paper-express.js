/**
 * Paper Express - 论文速递模块核心逻辑
 */

class PaperExpress {
    constructor() {
        this.currentPaper = null;
        this.mathBlocks = [];
        this.mathInlines = [];
        this.loadComplete = false;
        this.init();
    }

    init() {
        this.initMarked();
        this.bindEvents();
        this.bindGlobalClick();
        this.handleRoute();
    }

    bindGlobalClick() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.paper-note')) return;
            const expandedNotes = document.querySelectorAll('.paper-note-expand');
            expandedNotes.forEach(expandEl => {
                if (expandEl.style.display !== 'none' && !expandEl.contains(e.target)) {
                    const noteEl = expandEl.previousElementSibling;
                    if (noteEl && noteEl.classList.contains('paper-note')) {
                        expandEl.style.display = 'none';
                        noteEl.classList.remove('expanded');
                        noteEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                    }
                }
            });
        });
    }

    // 初始化 Marked 转换器
    initMarked() {
        // 配置 marked
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            xhtml: false,
            headerIds: false
        });

        // 自定义 renderer
        const renderer = new marked.Renderer();

        // 自定义 heading 渲染来添加锚点
        renderer.heading = ({ tokens, depth: level, text: rawText }) => {
            // 将 tokens 转换为纯文本
            const extractText = (tokens) => {
                if (!tokens) return '';
                return tokens.map(token => {
                    if (token.type === 'text') return token.text;
                    if (token.tokens) return extractText(token.tokens);
                    return '';
                }).join('');
            };
            const text = extractText(tokens);
            const anchor = this.generateAnchor(rawText || text);
            return `<h${level}><a id="${anchor}" class="anchor" href="#${anchor}"></a>${text}</h${level}>\n`;
        };

        // 自定义图片渲染 - 居中并添加标题
        renderer.image = ({ href, title, text }) => {
            const caption = text || title || '';
            // 确保图片路径相对于论文根目录
            const basePath = this.getBasePath();
            const paperPath = `papers/${this.currentPaper?.filename || ''}`;
            let imgSrc = href;
            
            // 处理相对路径
            if (href.startsWith('./')) {
                imgSrc = `${basePath}${paperPath}/${href.substring(2)}`;
            } else if (!href.startsWith('http') && !href.startsWith('/')) {
                imgSrc = `${basePath}${paperPath}/${href}`;
            }
            
            return `
                <figure class="image-figure">
                    <img src="${imgSrc}" alt="${text}" title="${title || ''}">
                    ${caption ? `<figcaption>${caption}</figcaption>` : ''}
                </figure>
            `;
        };

        marked.use({ renderer });
    }

    // 保护 LaTeX 公式
    protectMath(text) {
        this.mathBlocks = [];
        this.mathInlines = [];

        // 保护块级公式 $$...$$
        text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
            this.mathBlocks.push('$$' + formula + '$$');
            return `MATHBLOCK${this.mathBlocks.length - 1}ENDBLOCK`;
        });

        // 保护行内公式 $...$
        text = text.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
            this.mathInlines.push('$' + formula + '$');
            return `MATHINLINE${this.mathInlines.length - 1}ENDINLINE`;
        });

        return text;
    }

    // 恢复 LaTeX 公式
    restoreMath(text) {
        // 恢复块级公式
        text = text.replace(/MATHBLOCK(\d+)ENDBLOCK/g, (match, index) => {
            return this.mathBlocks[parseInt(index)] || match;
        });

        // 恢复行内公式
        text = text.replace(/MATHINLINE(\d+)ENDINLINE/g, (match, index) => {
            return this.mathInlines[parseInt(index)] || match;
        });

        return text;
    }

    // 生成锚点 ID
    generateAnchor(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    // 绑定事件
    bindEvents() {
        // 主题切换
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 移动端目录抽屉
        const tocToggle = document.getElementById('toc-toggle');
        const tocDrawer = document.getElementById('toc-drawer');
        const tocDrawerClose = document.getElementById('toc-drawer-close');
        const tocOverlay = document.getElementById('toc-overlay');

        if (tocToggle) {
            tocToggle.addEventListener('click', () => this.openTOCDrawer());
        }

        if (tocDrawerClose) {
            tocDrawerClose.addEventListener('click', () => this.closeTOCDrawer());
        }

        if (tocOverlay) {
            tocOverlay.addEventListener('click', () => this.closeTOCDrawer());
        }

        // 滚动事件：进度条 + 目录高亮
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
            this.updateTOCHighlight();
        });
    }

    // 处理路由 - 使用查询参数替代哈希路由
    handleRoute() {
        const urlParams = new URLSearchParams(window.location.search);
        const paper = urlParams.get('paper');

        if (paper) {
            this.loadPaper(paper);
        } else {
            this.showWelcome();
        }
    }

    // 获取基础路径 - 使用相对路径
    getBasePath() {
        // 论文文件相对于页面 URL 的位置
        return './';
    }

    // 加载论文
    async loadPaper(filename) {
        try {
            // 确保路径大小写正确
            const normalizedFilename = filename.toLowerCase();
            // 使用相对路径
            const basePath = this.getBasePath();
            const url = `${basePath}papers/${normalizedFilename}/${normalizedFilename}.md`;
            
            console.log('页面路径:', window.location.href);
            console.log('请求路径:', url);
            console.log('尝试加载论文:', url);
            
            const response = await fetch(url);
            console.log('响应状态:', response.status);
            
            if (!response.ok) {
                throw new Error(`无法加载论文: ${filename} (状态码: ${response.status})`);
            }

            const markdown = await response.text();
            console.log('论文加载成功，长度:', markdown.length);
            this.renderPaper(markdown, filename);
        } catch (error) {
            console.error('加载论文失败:', error);
            this.showError(`加载论文失败: ${error.message}`);
        }
    }

    // 解析 Front Matter
    parseFrontMatter(markdown) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = markdown.match(frontMatterRegex);

        if (match) {
            const frontMatter = match[1];
            const content = markdown.replace(frontMatterRegex, '');
            
            const metadata = {};
            frontMatter.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    
                    // 尝试解析 JSON 格式的值
                    try {
                        if (value.startsWith('[') || value.startsWith('{')) {
                            value = JSON.parse(value);
                        } else if (value.startsWith('"') && value.endsWith('"')) {
                            value = value.slice(1, -1);
                        }
                    } catch (e) {
                        // 保持原样
                    }
                    
                    metadata[key] = value;
                }
            });

            return { metadata, content };
        }

        return { metadata: {}, content: markdown };
    }

    // 渲染论文
    renderPaper(markdown, filename) {
        const { metadata, content } = this.parseFrontMatter(markdown);
        this.currentPaper = { filename, metadata };
        
        this.noteCache = {};

        // 渲染编者按
        this.renderEditorNote(metadata);

        // 渲染元信息
        this.renderMetadata(metadata);

        // 渲染 Markdown 内容
        const protectedContent = this.protectMath(content);
        let html = marked.parse(protectedContent);
        html = this.restoreMath(html);
        const contentEl = document.getElementById('markdown-content');
        contentEl.innerHTML = html;

        // 解析并渲染标注
        this.parseAndRenderNotes(contentEl);

        // 代码高亮
        contentEl.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // 渲染数学公式并等待完成后隐藏加载屏幕
        this.renderMathAndHideLoading(contentEl);

        // 生成目录
        this.generateTOC(contentEl);

        // 滚动到顶部
        window.scrollTo(0, 0);

        // 更新页面标题
        document.title = metadata.title 
            ? `${metadata.title} - Paper Express` 
            : 'Paper Express - 论文速递';
    }

    // 解析并渲染标注
    parseAndRenderNotes(contentEl) {
        const noteRegex = /\{\{note:([^|]+)\|([^}]+)\}\}/g;
        
        const walkNodes = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent;
                if (noteRegex.test(text)) {
                    const span = document.createElement('span');
                    span.innerHTML = text.replace(noteRegex, (match, filename, displayText) => {
                        const noteId = `note-${filename}-${Math.random().toString(36).substr(2, 9)}`;
                        return `<span class="paper-note" data-note-file="${filename}" data-note-id="${noteId}">${displayText}</span>`;
                    });
                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName !== 'CODE' && node.tagName !== 'PRE') {
                    Array.from(node.childNodes).forEach(walkNodes);
                }
            }
        };
        
        walkNodes(contentEl);
        
        contentEl.querySelectorAll('.paper-note').forEach(noteEl => {
            noteEl.addEventListener('click', (e) => this.toggleNote(e.target));
        });
    }

    // 关闭所有已展开的note
    closeAllExpandedNotes(exceptNoteEl) {
        const expandedNotes = document.querySelectorAll('.paper-note.expanded');
        expandedNotes.forEach(expandedNote => {
            if (expandedNote !== exceptNoteEl) {
                expandedNote.classList.remove('expanded');
                const noteId = expandedNote.dataset.noteId;
                const expandEl = document.getElementById(noteId);
                if (expandEl) {
                    expandEl.style.display = 'none';
                }
            }
        });
    }

    // 切换标注展开/收起
    async toggleNote(noteEl) {
        const noteId = noteEl.dataset.noteId;
        const noteFile = noteEl.dataset.noteFile;
        
        let expandEl = document.getElementById(noteId);
        
        if (expandEl) {
            if (expandEl.style.display === 'none') {
                this.closeAllExpandedNotes(noteEl);
                expandEl.style.display = 'block';
                noteEl.classList.add('expanded');
            } else {
                expandEl.style.display = 'none';
                noteEl.classList.remove('expanded');
                noteEl.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
            return;
        }
        
        this.closeAllExpandedNotes(noteEl);
        noteEl.classList.add('loading');
        
        try {
            let noteContent;
            if (this.noteCache[noteFile]) {
                noteContent = this.noteCache[noteFile];
            } else {
                noteContent = await this.loadNoteFile(noteFile);
                this.noteCache[noteFile] = noteContent;
            }
            
            expandEl = document.createElement('div');
            expandEl.id = noteId;
            expandEl.className = 'paper-note-expand';
            expandEl.innerHTML = noteContent;
            
            noteEl.parentNode.insertBefore(expandEl, noteEl.nextSibling);
            noteEl.classList.add('expanded');
            
            expandEl.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            this.renderMath(expandEl);
            
        } catch (error) {
            console.error('加载注释失败:', error);
            const errorEl = document.createElement('div');
            errorEl.className = 'paper-note-expand paper-note-error';
            errorEl.textContent = `加载失败: ${error.message}`;
            noteEl.parentNode.insertBefore(errorEl, noteEl.nextSibling);
        } finally {
            noteEl.classList.remove('loading');
        }
    }

    // 加载注释文件
    async loadNoteFile(filename) {
        const basePath = this.getBasePath();
        const url = `${basePath}papers/${this.currentPaper.filename}/${filename}.md`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`文件不存在: ${filename}`);
        }
        
        const markdown = await response.text();
        const { metadata, content } = this.parseFrontMatter(markdown);

        const protectedContent = this.protectMath(content);
        let html = marked.parse(protectedContent);
        html = this.restoreMath(html);

        const title = metadata.title;

        const headerHtml = title ? `
            <div class="paper-note-header">
                <span class="paper-note-title">${title}</span>
            </div>
        ` : '';

        return `${headerHtml}<div class="paper-note-body">${html}</div>`;
    }

    // 渲染编者按
    renderEditorNote(metadata) {
        const noteEl = document.getElementById('editor-note');
        const contentEl = document.getElementById('editor-note-content');

        if (metadata.editor_note) {
            noteEl.style.display = 'block';
            // 支持多行编者按
            const noteContent = Array.isArray(metadata.editor_note) 
                ? metadata.editor_note.map(p => `<p>${p}</p>`).join('') 
                : `<p>${metadata.editor_note}</p>`;
            contentEl.innerHTML = noteContent;
        } else {
            noteEl.style.display = 'none';
        }
    }

    // 渲染元信息
    renderMetadata(metadata) {
        const metaEl = document.getElementById('paper-meta');
        
        if (Object.keys(metadata).length === 0) {
            metaEl.style.display = 'none';
            return;
        }

        metaEl.style.display = 'block';

        // 标题
        const titleEl = document.getElementById('meta-title');
        titleEl.textContent = metadata.title || '未命名论文';

        // 作者
        const authorsEl = document.getElementById('meta-authors');
        if (metadata.authors) {
            const authors = Array.isArray(metadata.authors) 
                ? metadata.authors 
                : [metadata.authors];
            authorsEl.innerHTML = authors.map(a => `<span class="author">${a}</span>`).join('');
        } else {
            authorsEl.innerHTML = '';
        }

        // 显示文摘发布时间（在标题上方）
        const digestInfoEl = document.getElementById('digest-info');
        const digestTimeEl = document.getElementById('meta-digest-time');
        if (metadata.digest_pub_time) {
            digestInfoEl.style.display = 'flex';
            digestTimeEl.textContent = metadata.digest_pub_time;
        } else {
            digestInfoEl.style.display = 'none';
        }

        // 显示文摘作者
        const digestAuthorEl = document.getElementById('digest-author');
        const digestAuthorNameEl = document.getElementById('meta-digest-author');
        if (metadata.editor) {
            digestAuthorEl.style.display = 'flex';
            digestAuthorNameEl.textContent = metadata.editor;
        } else {
            digestAuthorEl.style.display = 'none';
        }

        // 显示论文发布时间和发表 venue
        document.getElementById('meta-date').textContent = metadata.date || '';
        document.getElementById('meta-venue').textContent = metadata.venue || '';

        // 标签
        const tagsEl = document.getElementById('meta-tags');
        if (metadata.tags) {
            const tags = Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags];
            tagsEl.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
        } else {
            tagsEl.innerHTML = '';
        }

        // 链接
        const linksEl = document.getElementById('meta-links');
        let linksHtml = '';
        if (metadata.pdf_url) {
            linksHtml += `<a href="${metadata.pdf_url}" target="_blank" class="link-btn">📄 PDF</a>`;
        }
        if (metadata.code_url) {
            linksHtml += `<a href="${metadata.code_url}" target="_blank" class="link-btn">💻 Code</a>`;
        }
        linksEl.innerHTML = linksHtml;
        linksEl.style.display = linksHtml ? 'flex' : 'none';
        linksEl.style.gap = '16px';
    }

    // 生成目录
    generateTOC(contentEl) {
        const headings = contentEl.querySelectorAll('h1, h2, h3');
        const tocList = document.getElementById('toc-list');
        const tocDrawerList = document.getElementById('toc-drawer-list');
        
        if (headings.length === 0) {
            document.getElementById('toc-nav').style.display = 'none';
            this.headings = [];
            if (tocDrawerList) tocDrawerList.innerHTML = '';
            return;
        }

        document.getElementById('toc-nav').style.display = 'block';
        tocList.innerHTML = '';
        if (tocDrawerList) tocDrawerList.innerHTML = '';
        
        // 存储标题元素引用
        this.headings = [];

        // 添加编者按（如果存在）
        const editorNote = document.getElementById('editor-note');
        if (editorNote && editorNote.style.display !== 'none') {
            this.addTOCItem(tocList, tocDrawerList, 'toc-special toc-editor-note', 
                '<i class="fa-solid fa-pen-fancy"></i> 编者按', 
                '#editor-note', editorNote);
        }

        // 添加论文信息
        const paperMeta = document.getElementById('paper-meta');
        if (paperMeta && paperMeta.style.display !== 'none') {
            this.addTOCItem(tocList, tocDrawerList, 'toc-special toc-paper-meta',
                '<i class="fa-solid fa-file-lines"></i> 论文信息',
                '#paper-meta', paperMeta);
        }

        // 添加分隔线
        if (this.headings.length > 0) {
            const divider = document.createElement('li');
            divider.className = 'toc-divider';
            tocList.appendChild(divider);
            
            if (tocDrawerList) {
                const drawerDivider = document.createElement('li');
                drawerDivider.className = 'toc-divider';
                tocDrawerList.appendChild(drawerDivider);
            }
        }

        headings.forEach(heading => {
            this.addTOCItem(tocList, tocDrawerList, `toc-${heading.tagName.toLowerCase()}`,
                heading.textContent.replace('¶', '').trim(),
                `#${heading.id}`, heading);
        });
        
        // 初始化高亮
        this.updateTOCHighlight();
    }

    // 添加目录项到两个列表
    addTOCItem(desktopList, mobileList, className, text, href, targetElement) {
        // 桌面端目录项
        const desktopLi = document.createElement('li');
        desktopLi.className = className;
        
        const desktopA = document.createElement('a');
        desktopA.href = href;
        desktopA.innerHTML = text;
        desktopA.addEventListener('click', (e) => {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
        
        desktopLi.appendChild(desktopA);
        desktopList.appendChild(desktopLi);
        
        // 移动端目录项
        if (mobileList) {
            const mobileLi = document.createElement('li');
            mobileLi.className = className;
            
            const mobileA = document.createElement('a');
            mobileA.href = href;
            mobileA.innerHTML = text;
            mobileA.addEventListener('click', (e) => {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                this.closeTOCDrawer();
            });
            
            mobileLi.appendChild(mobileA);
            mobileList.appendChild(mobileLi);
            
            // 存储标题和对应的目录项（使用桌面端的链接作为主链接）
            this.headings.push({
                element: targetElement,
                tocLink: desktopA,
                mobileTocLink: mobileA
            });
        } else {
            this.headings.push({
                element: targetElement,
                tocLink: desktopA
            });
        }
    }

    // 更新目录高亮
    updateTOCHighlight() {
        if (!this.headings || this.headings.length === 0) return;

        const headerHeight = 100; // 顶部工具栏高度 + 缓冲

        // 找到当前可见的标题
        let currentHeading = null;
        
        for (let i = this.headings.length - 1; i >= 0; i--) {
            const heading = this.headings[i].element;
            const rect = heading.getBoundingClientRect();
            
            // 当标题顶部在工具栏下方一定距离内时高亮
            if (rect.top <= headerHeight) {
                currentHeading = this.headings[i];
                break;
            }
        }

        // 更新高亮状态
        this.headings.forEach(item => {
            if (currentHeading && item === currentHeading) {
                item.tocLink.classList.add('active');
                if (item.mobileTocLink) {
                    item.mobileTocLink.classList.add('active');
                }
            } else {
                item.tocLink.classList.remove('active');
                if (item.mobileTocLink) {
                    item.mobileTocLink.classList.remove('active');
                }
            }
        });

        // 滚动目录导航，使当前高亮项可见
        if (currentHeading) {
            const tocNav = document.getElementById('toc-nav');
            const activeLink = currentHeading.tocLink;
            
            // 计算高亮项相对于目录容器的位置
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = tocNav.getBoundingClientRect();
            
            // 如果高亮项不在可视区域内，滚动目录
            if (linkRect.top < navRect.top) {
                // 高亮项在可视区域上方
                tocNav.scrollTop -= (navRect.top - linkRect.top + 20);
            } else if (linkRect.bottom > navRect.bottom) {
                // 高亮项在可视区域下方
                tocNav.scrollTop += (linkRect.bottom - navRect.bottom + 20);
            }
        }
    }

    // 打开移动端目录抽屉
    openTOCDrawer() {
        const tocDrawer = document.getElementById('toc-drawer');
        const tocOverlay = document.getElementById('toc-overlay');
        
        if (tocDrawer) {
            tocDrawer.classList.add('open');
        }
        if (tocOverlay) {
            tocOverlay.classList.add('show');
        }
        document.body.style.overflow = 'hidden';
    }

    // 关闭移动端目录抽屉
    closeTOCDrawer() {
        const tocDrawer = document.getElementById('toc-drawer');
        const tocOverlay = document.getElementById('toc-overlay');
        
        if (tocDrawer) {
            tocDrawer.classList.remove('open');
        }
        if (tocOverlay) {
            tocOverlay.classList.remove('show');
        }
        document.body.style.overflow = '';
    }

    // 显示欢迎页面
    showWelcome() {
        document.getElementById('paper-meta').style.display = 'none';
        document.getElementById('markdown-content').innerHTML = `
            <div class="welcome-screen">
                <h2>欢迎使用 Paper Express</h2>
                <p>请在 URL 中指定论文文件名，例如：<code>?paper=example-paper</code></p>
            </div>
        `;
        document.getElementById('toc-nav').style.display = 'none';
        document.title = 'Paper Express - 论文速递';
    }

    // 显示错误
    showError(message) {
        document.getElementById('markdown-content').innerHTML = `
            <div class="error-screen">
                <h2>⚠️ 出错了</h2>
                <p>${message}</p>
            </div>
        `;
    }

    // 切换主题
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // 更新 FontAwesome 图标
        const toggleBtn = document.getElementById('theme-toggle');
        toggleBtn.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
        
        // 切换代码高亮主题
        this.toggleHighlightTheme(isDark);
    }

    // 切换代码高亮主题
    toggleHighlightTheme(isDark) {
        const lightTheme = document.getElementById('hljs-light-theme');
        const darkTheme = document.getElementById('hljs-dark-theme');
        
        if (lightTheme && darkTheme) {
            lightTheme.disabled = isDark;
            darkTheme.disabled = !isDark;
        }
    }

    // 更新进度条
    updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    }

    // 渲染数学公式
    renderMath(contentEl) {
        if (window.renderMathInElement) {
            renderMathInElement(contentEl, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false,
                strict: false
            });
        }
    }

    // 渲染数学公式并隐藏加载屏幕
    renderMathAndHideLoading(contentEl) {
        const hideLoadingScreen = () => {
            if (this.loadComplete) return;
            this.loadComplete = true;
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        };

        if (window.renderMathInElement) {
            try {
                renderMathInElement(contentEl, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false,
                    strict: false
                });
            } catch (e) {
                console.warn('Math rendering error:', e);
            }
            hideLoadingScreen();
        } else {
            const checkKatex = setInterval(() => {
                if (window.renderMathInElement) {
                    clearInterval(checkKatex);
                    clearTimeout(fallbackTimeout);
                    try {
                        renderMathInElement(contentEl, {
                            delimiters: [
                                {left: '$$', right: '$$', display: true},
                                {left: '$', right: '$', display: false},
                                {left: '\\(', right: '\\)', display: false},
                                {left: '\\[', right: '\\]', display: true}
                            ],
                            throwOnError: false,
                            strict: false
                        });
                    } catch (e) {
                        console.warn('Math rendering error:', e);
                    }
                    hideLoadingScreen();
                }
            }, 50);

            const fallbackTimeout = setTimeout(() => {
                clearInterval(checkKatex);
                hideLoadingScreen();
            }, 5000);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.paperExpress = new PaperExpress();
    
    // 恢复主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').innerHTML = '<i class="fa-solid fa-sun"></i>';
        window.paperExpress.toggleHighlightTheme(true);
    }
    
    // 如果没有加载论文（显示欢迎页面），直接隐藏加载屏幕
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('paper')) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
});
