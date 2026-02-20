#!/bin/bash

echo "========================================"
echo "  论文标题规范化工具"
echo "========================================"
echo ""
read -p "请输入论文标题: " paper_title
echo ""

normalized_title=$(echo "$paper_title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

echo "规范化后的标题: $normalized_title"
echo ""
echo "请选择要创建的项目:"
echo "  1. Paper Guide"
echo "  2. Paper Express"
echo ""
read -p "请输入选项 (1/2): " choice
echo ""

express_dir="paper-express/papers/$normalized_title"
guide_dir="paper-guide/papers/$normalized_title"

create_template() {
    local dir=$1
    mkdir -p "$dir/notes"
    mkdir -p "$dir/imgs"
    echo "创建目录: $dir"
    echo "创建目录: $dir/notes"
    echo "创建目录: $dir/imgs"
    
    cat > "$dir/$normalized_title.md" << EOF
---
title: "$paper_title"
authors: ["Author Name"]
date: "2024-01-01"
tags: ["Tag1", "Tag2"]
venue: "Conference/Journal"
pdf_url: "#"
code_url: "#"
editor: "Editor Name"
editor_note: ["编者按第一段", "编者按第二段"]
digest_pub_time: "2026-02-20"
---

# $paper_title

## 摘要

## 引言

## 方法

![示例图片](imgs/example.png)

## 实验

## 结论
EOF
    echo "创建模板文件: $dir/$normalized_title.md"
}

if [ "$choice" = "1" ]; then
    create_template "$guide_dir"
elif [ "$choice" = "2" ]; then
    create_template "$express_dir"
else
    echo "无效选项！"
    exit 1
fi

echo ""
echo "========================================"
echo "  完成！"
echo "========================================"
