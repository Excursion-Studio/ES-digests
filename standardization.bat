@echo off
chcp 936 >nul 2>&1
setlocal enabledelayedexpansion

echo ========================================
echo   论文文件命名规范化工具
echo ========================================
echo.

echo 请选择目标模块:
echo   [1] Paper Guide  (论文导读)
echo   [2] Paper Express (论文速递)
echo.
set /p "module=请输入选项 (1/2): "

if "%module%"=="1" (
    set "module_dir=paper-guide"
) else if "%module%"=="2" (
    set "module_dir=paper-express"
) else (
    echo 错误：无效选项
    goto :end
)

echo.
set /p "title=请输入论文标题: "

if "%title%"=="" (
    echo 错误：标题不能为空
    goto :end
)

for /f "usebackq delims=" %%i in (`powershell -command "$t='%title%'.Replace(' ', '-').Replace(' ', '-').Replace('_', '-'); $t=[regex]::Replace($t, '[^a-zA-Z0-9\-]', '').ToLower(); while($t.Contains('--')){$t=$t.Replace('--', '-')}; Write-Output $t"`) do set "normalized=%%i"

echo.
echo ========================================
echo   目标模块: %module_dir%
echo   原始标题: %title%
echo   规范名称: !normalized!
echo ========================================
echo.

set /p "confirm=是否创建论文文件夹结构? (Y/N): "
if /i "!confirm!"=="Y" (
    set "target=%module_dir%\papers\!normalized!"
    
    if exist "!target!" (
        echo 警告：文件夹已存在: !target!
    ) else (
        mkdir "!target!"
        mkdir "!target!\notes"
        echo 已创建文件夹: !target!
        echo 已创建文件夹: !target!\notes
    )
    
    echo.
    set /p "create_md=是否创建论文模板文件? (Y/N): "
    if /i "!create_md!"=="Y" (
        set "md_file=!target!\!normalized!.md"
        
        (
            echo ---
            echo title: "%title%"
            echo authors: ["作者1", "作者2"]
            echo date: "论文发表日期 (e.g. 2024-01-01)"
            echo tags: ["标签1", "标签2"]
            echo venue: "会议/期刊名称"
            echo pdf_url: "https://arxiv.org/..."
            echo code_url: "https://github.com/..."  # 可选，代码仓库链接
            echo editor: "文摘作者"
            echo editor_note: ["编者按第一段", "编者按第二段"]
            echo digest_pub_time: "本文摘发布时间 (e.g. 2026-01-01)"
            echo ---
            echo.
            echo # 摘要
            echo.
            echo 论文摘要内容...
            echo.
            echo ---
            echo.
            echo # 1. 引言
            echo.
            echo 正文内容...
        ) > "!md_file!"
        
        echo 已创建文件: !md_file!
    )
)

echo.
echo 完成！

:end
echo.
echo 按任意键退出...
pause >nul
