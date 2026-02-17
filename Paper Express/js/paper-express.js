/**
 * Paper Express - 论文速递模块核心逻辑
 */

class PaperExpress {
    constructor() {
        this.converter = null;
        this.currentPaper = null;
        this.init();
    }

    init() {
        this.initShowdown();
        this.bindEvents();
        this.handleRoute();
    }

    // 初始化 Showdown 转换器
    initShowdown() {
        this.converter = new showdown.Converter({
            tables: true,
            tasklists: true,
            strikethrough: true,
            emoji: true,
            simplifiedAutoLink: true,
            ghCodeBlocks: true,
            smoothLivePreview: true,
            headerLevelStart: 1,
            parseImgDimensions: true,
            openLinksInNewWindow: true,
            backslashEscapesHTMLTags: true,
            literalMidWordUnderscores: true,
            excludeTrailingPunctuationFromURLs: true
        });

        // 自定义扩展：保护 LaTeX 公式不被 Markdown 处理
        this.converter.addExtension({
            type: 'lang',
            filter: (text) => {
                // 先保护块级公式 $$...$$
                let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
                    const encoded = btoa(unescape(encodeURIComponent('$$' + formula + '$$')));
                    return `MATHBLOCK${encoded}ENDBLOCK`;
                });
                // 再保护行内公式 $...$
                result = result.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
                    const encoded = btoa(unescape(encodeURIComponent('$' + formula + '$')));
                    return `MATHINLINE${encoded}ENDINLINE`;
                });
                return result;
            }
        });

        // 后处理扩展：恢复 LaTeX 公式
        this.converter.addExtension({
            type: 'output',
            filter: (text) => {
                // 恢复块级公式
                let result = text.replace(/MATHBLOCK([A-Za-z0-9+/=]+)ENDBLOCK/g, (match, encoded) => {
                    try {
                        return decodeURIComponent(escape(atob(encoded)));
                    } catch (e) {
                        return match;
                    }
                });
                // 恢复行内公式
                result = result.replace(/MATHINLINE([A-Za-z0-9+/=]+)ENDINLINE/g, (match, encoded) => {
                    try {
                        return decodeURIComponent(escape(atob(encoded)));
                    } catch (e) {
                        return match;
                    }
                });
                return result;
            }
        });

        // 自定义扩展：为标题添加锚点
        this.converter.addExtension({
            type: 'lang',
            regex: /^(#{1,6})\s+(.+)$/gm,
            replace: (match, level, text) => {
                const anchor = this.generateAnchor(text);
                return `${level} <a id="${anchor}" class="anchor" href="#${anchor}"></a>${text}`;
            }
        });
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
        // 路由变化监听
        window.addEventListener('hashchange', () => this.handleRoute());

        // 主题切换
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 滚动事件：进度条 + 目录高亮
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
            this.updateTOCHighlight();
        });
    }

    // 处理路由
    handleRoute() {
        const hash = window.location.hash;
        const match = hash.match(/^#\/paper\/(.+)$/);

        if (match) {
            const filename = match[1];
            this.loadPaper(filename);
        } else {
            this.showWelcome();
        }
    }

    // 加载论文
    async loadPaper(filename) {
        try {
            const response = await fetch(`papers/${filename}/${filename}.md`);
            if (!response.ok) {
                throw new Error(`无法加载论文: ${filename}`);
            }

            const markdown = await response.text();
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

        // 渲染编者按
        this.renderEditorNote(metadata);

        // 渲染元信息
        this.renderMetadata(metadata);

        // 渲染 Markdown 内容
        const html = this.converter.makeHtml(content);
        const contentEl = document.getElementById('markdown-content');
        contentEl.innerHTML = html;

        // 代码高亮
        contentEl.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // 渲染数学公式
        this.renderMath(contentEl);

        // 生成目录
        this.generateTOC(contentEl);

        // 滚动到顶部
        window.scrollTo(0, 0);

        // 更新页面标题
        document.title = metadata.title 
            ? `${metadata.title} - Paper Express` 
            : 'Paper Express - 论文速递';
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

        // 日期和发表 venue
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
        linksEl.style.display = linksHtml ? 'block' : 'none';
    }

    // 生成目录
    generateTOC(contentEl) {
        const headings = contentEl.querySelectorAll('h1, h2, h3');
        const tocList = document.getElementById('toc-list');
        
        if (headings.length === 0) {
            document.getElementById('toc-nav').style.display = 'none';
            this.headings = [];
            return;
        }

        document.getElementById('toc-nav').style.display = 'block';
        tocList.innerHTML = '';
        
        // 存储标题元素引用
        this.headings = [];

        // 添加编者按（如果存在）
        const editorNote = document.getElementById('editor-note');
        if (editorNote && editorNote.style.display !== 'none') {
            const li = document.createElement('li');
            li.className = 'toc-special toc-editor-note';
            
            const a = document.createElement('a');
            a.href = '#editor-note';
            a.innerHTML = '<i class="fa-solid fa-pen-fancy"></i> 编者按';
            a.addEventListener('click', (e) => {
                e.preventDefault();
                editorNote.scrollIntoView({ behavior: 'smooth' });
            });

            li.appendChild(a);
            tocList.appendChild(li);
            
            this.headings.push({
                element: editorNote,
                tocLink: a
            });
        }

        // 添加论文信息
        const paperMeta = document.getElementById('paper-meta');
        if (paperMeta && paperMeta.style.display !== 'none') {
            const li = document.createElement('li');
            li.className = 'toc-special toc-paper-meta';
            
            const a = document.createElement('a');
            a.href = '#paper-meta';
            a.innerHTML = '<i class="fa-solid fa-file-lines"></i> 论文信息';
            a.addEventListener('click', (e) => {
                e.preventDefault();
                paperMeta.scrollIntoView({ behavior: 'smooth' });
            });

            li.appendChild(a);
            tocList.appendChild(li);
            
            this.headings.push({
                element: paperMeta,
                tocLink: a
            });
        }

        // 添加分隔线
        if (this.headings.length > 0) {
            const divider = document.createElement('li');
            divider.className = 'toc-divider';
            tocList.appendChild(divider);
        }

        headings.forEach(heading => {
            const li = document.createElement('li');
            li.className = `toc-${heading.tagName.toLowerCase()}`;
            
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent.replace('¶', '').trim();
            a.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            });

            li.appendChild(a);
            tocList.appendChild(li);
            
            // 存储标题和对应的目录项
            this.headings.push({
                element: heading,
                tocLink: a
            });
        });
        
        // 初始化高亮
        this.updateTOCHighlight();
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
            } else {
                item.tocLink.classList.remove('active');
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

    // 显示欢迎页面
    showWelcome() {
        document.getElementById('paper-meta').style.display = 'none';
        document.getElementById('markdown-content').innerHTML = `
            <div class="welcome-screen">
                <h2>欢迎使用 Paper Express</h2>
                <p>请在 URL 中指定论文文件名，例如：<code>#/paper/example-paper</code></p>
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
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([contentEl]).catch((err) => console.log('MathJax error:', err));
        } else if (window.MathJax && MathJax.Hub) {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, contentEl]);
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
    }
});
