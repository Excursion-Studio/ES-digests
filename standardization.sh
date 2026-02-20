#!/bin/bash

echo "========================================"
echo "  论文文件命名规范化工具"
echo "========================================"
echo

echo "请选择目标模块:"
echo "  [1] Paper Guide  (论文导读)"
echo "  [2] Paper Express (论文速递)"
echo
read -p "请输入选项 (1/2): " module

case $module in
    1) module_dir="paper-guide" ;;
    2) module_dir="paper-express" ;;
    *) echo "错误：无效选项"; exit 1 ;;
esac

echo
read -p "请输入论文标题: " title

if [ -z "$title" ]; then
    echo "错误：标题不能为空"
    exit 1
fi

normalized=$(echo "$title" | \
    tr '[:upper:]' '[:lower:]' | \
    tr ' _' '-' | \
    sed 's/[^a-z0-9-]//g' | \
    sed 's/--*/-/g' | \
    sed 's/^-\|-$//g')

echo
echo "========================================"
echo "  目标模块: $module_dir"
echo "  原始标题: $title"
echo "  规范名称: $normalized"
echo "========================================"
echo

read -p "是否创建论文文件夹结构? (y/n): " confirm
if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    target="$module_dir/papers/$normalized"
    
    if [ -d "$target" ]; then
        echo "警告：文件夹已存在: $target"
    else
        mkdir -p "$target/notes"
        echo "已创建文件夹: $target"
        echo "已创建文件夹: $target/notes"
    fi
    
    echo
    read -p "是否创建论文模板文件? (y/n): " create_md
    if [ "$create_md" = "y" ] || [ "$create_md" = "Y" ]; then
        md_file="$target/$normalized.md"
        
        cat > "$md_file" << EOF
---
title: "$title"
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

# 摘要

论文摘要内容...

---

# 1. 引言

正文内容...
EOF
        
        echo "已创建文件: $md_file"
    fi
fi

echo
echo "完成！"
