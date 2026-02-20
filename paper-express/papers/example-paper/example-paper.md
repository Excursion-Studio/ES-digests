---
title: "示例论文：如何使用 Paper Express"
authors: ["Paper Express Team"]
date: "2024-01-01"
tags: ["Tutorial", "Express"]
venue: "Paper Express Documentation"
pdf_url: "#"
code_url: "#"
editor: "远行"
editor_note: ["这是一篇示例论文。", "展示了 Paper Express 支持的 Markdown 格式和功能。"]
digest_pub_time: "2026-02-17"
---

# 欢迎使用 Paper Express

这是一篇示例论文，展示了 Paper Express 支持的 Markdown 格式和功能。

---

# 1. 基础 Markdown 语法

## 1.1 文本格式

你可以使用以下格式：

- **粗体文本**
- *斜体文本*
- ~~删除线文本~~
- `行内代码`

## 1.2 列表

无序列表：
- 第一项
- 第二项
  - 嵌套项 1
  - 嵌套项 2
- 第三项

有序列表：
1. 第一步
2. 第二步
3. 第三步

## 1.3 引用

> 这是一个引用块。
> 可以包含多行文本。

---

# 2. 代码块

支持语法高亮的代码块：

```python
def hello_world():
    print("Hello, Paper Express!")
    return True

# 调用函数
hello_world()
```

```javascript
// JavaScript 示例
const paperExpress = {
    name: 'Paper Express',
    version: '1.0.0',
    features: ['Markdown', 'Code Highlight', 'Dark Mode']
};

console.log(paperExpress);
```

---

# 3. 表格

| 功能 | 支持状态 | 说明 |
|------|---------|------|
| Markdown 渲染 | ✅ | 完整支持 |
| 代码高亮 | ✅ | 使用 highlight.js |
| 暗色主题 | ✅ | 一键切换 |
| 目录导航 | ✅ | 自动生成 |
| 数学公式 | 🚧 | 即将支持 |

---

# 4. 论文写作建议

## 4.1 快速创建新论文

项目提供了自动化脚本，可快速创建符合命名规范的论文文件夹和模板文件：

- **Windows**: 双击运行 `standardization.bat`
- **Linux/macOS**: 终端运行 `./standardization.sh`

脚本会自动将论文标题转换为规范命名（小写、连字符分隔），并创建完整的文件夹结构。

## 4.2 使用 Front Matter

每篇论文 Markdown 文件的开头应该包含元数据：

```yaml
---
title: "论文标题"
authors: ["作者1", "作者2"]
date: "论文发表日期 (e.g. 2024-01-01)"
tags: ["标签1", "标签2"]
venue: "会议/期刊名称"
pdf_url: "https://arxiv.org/..."
code_url: "https://github.com/..."  # 可选，代码仓库链接
editor: "文摘作者"
editor_note: ["编者按第一段", "编者按第二段"]
digest_pub_time: "本文摘发布时间 (e.g. 2026-01-01)"
---
```

## 4.3 结构化内容

建议按以下结构组织论文：

1. **摘要** - 简要概述论文贡献
2. **引言** - 研究背景和动机
3. **方法** - 技术细节
4. **实验** - 实验设置和结果
5. **结论** - 总结和展望

---

# 5. 高级功能

## 5.1 展开式注释

你可以在正文中添加可展开的注释，点击后会加载并显示其他 Markdown 文件的内容。

例如：这里有一个关于{{note:notes/self-attention|自注意力机制}}的详细说明，点击即可展开查看。

### 使用语法

```markdown
{{note:文件路径|显示文本}}
```

- `文件路径`：相对于当前论文目录的 Markdown 文件路径（不含 `.md` 扩展名）
- `显示文本`：点击前显示的文字

### 文件结构示例

```
papers/
└── my-paper/
    ├── my-paper.md          # 主论文
    └── notes/
        ├── detail1.md       # 注释文件1
        └── detail2.md       # 注释文件2
```

## 5.2 任务列表

- [x] 创建项目结构
- [x] 实现 Markdown 渲染
- [x] 添加代码高亮
- [ ] 添加数学公式支持
- [ ] 添加搜索功能

## 5.3 链接

- [外部链接](https://github.com/showdownjs/showdown)
- [内部锚点](#欢迎使用-paper-express)

---

# 6. 总结

Paper Express 让论文阅读和分享变得简单：

1. 将 Markdown 文件放入 `papers/` 目录
2. 在 `papers.json` 中添加论文信息
3. 通过 `index.html?paper=文件名` 访问

开始编写你的论文速递吧！
