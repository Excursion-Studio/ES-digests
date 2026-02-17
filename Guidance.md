# Paper Guide 和 Paper Express 使用说明

一个简洁优雅的论文导读与论文速递模块，支持 Markdown 渲染、数学公式、代码高亮。

## 添加新论文

### 步骤 1：创建 Markdown 文件

在 `papers/` 目录下创建同名文件夹，然后在文件夹中创建 `.md` 文件，例如：

```
papers/
└── my-paper/
    └── my-paper.md
```

文件内容：

```markdown
---
title: "论文标题"
authors: ["作者1", "作者2"]
date: "论文发表日期"
tags: ["标签1", "标签2"]
venue: "会议/期刊名称"
pdf_url: "https://arxiv.org/..."
code_url: "https://github.com/..." // 可选，代码仓库链接
editor_note: ["编者按第一段", "编者按第二段"]
digest_pub_time: "本文摘发布时间"
---

# 摘要

论文摘要内容...

# 1. 引言

正文内容...
```

### 步骤 2：访问论文

浏览器访问：`http://localhost:8080#/paper/my-paper`

（将 `my-paper` 替换为你的文件名，不含 `.md` 扩展名）

## Front Matter 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 论文标题 |
| `authors` | array | ✅ | 作者列表 |
| `date` | string | ✅ | 发表日期 (YYYY-MM-DD) |
| `tags` | array | ⬜ | 标签列表 |
| `venue` | string | ⬜ | 发表会议/期刊 |
| `pdf_url` | string | ⬜ | PDF 链接 |
| `code_url` | string | ⬜ | 代码仓库链接 |
| `editor_note` | array/string | ⬜ | 编者按内容 |

## Markdown 语法支持

### 数学公式

行内公式：`$E = mc^2$` → $E = mc^2$

块级公式：
```markdown
$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$
```

### 代码块

```python
def hello():
    print("Hello, Paper Guide!")
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
```

### 引用

```markdown
> 这是一段引用文字
```

## 自定义配置

### 修改站点标题

编辑 `index.html`：
```html
<span class="site-name">你的标题</span>
```

编辑 `css/main.css`：
```css
.site-icon {
    background-image: url('你的图标URL');
}
```

### 修改主题颜色

编辑 `css/main.css` 中的 CSS 变量：
```css
:root {
    --primary-color: #2563eb;
    --bg-color: #f8fafc;
    /* ... */
}
```

## 功能特性

- ✅ Markdown 渲染 (Showdown.js)
- ✅ 数学公式 (MathJax 3)
- ✅ 代码高亮 (highlight.js)
- ✅ 暗色/亮色主题切换
- ✅ 目录自动生成
- ✅ 阅读进度条
- ✅ 目录滚动跟踪
- ✅ 响应式设计
- ✅ 编者按支持
