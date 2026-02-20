@echo off
chcp 65001 >nul
echo ========================================
echo   论文标题规范化工具
echo ========================================
echo.
set /p paper_title=请输入论文标题: 
echo.

set "normalized_title=%paper_title%"

set "normalized_title=%normalized_title: =-%"

set "normalized_title=%normalized_title:A=a%"
set "normalized_title=%normalized_title:B=b%"
set "normalized_title=%normalized_title:C=c%"
set "normalized_title=%normalized_title:D=d%"
set "normalized_title=%normalized_title:E=e%"
set "normalized_title=%normalized_title:F=f%"
set "normalized_title=%normalized_title:G=g%"
set "normalized_title=%normalized_title:H=h%"
set "normalized_title=%normalized_title:I=i%"
set "normalized_title=%normalized_title:J=j%"
set "normalized_title=%normalized_title:K=k%"
set "normalized_title=%normalized_title:L=l%"
set "normalized_title=%normalized_title:M=m%"
set "normalized_title=%normalized_title:N=n%"
set "normalized_title=%normalized_title:O=o%"
set "normalized_title=%normalized_title:P=p%"
set "normalized_title=%normalized_title:Q=q%"
set "normalized_title=%normalized_title:R=r%"
set "normalized_title=%normalized_title:S=s%"
set "normalized_title=%normalized_title:T=t%"
set "normalized_title=%normalized_title:U=u%"
set "normalized_title=%normalized_title:V=v%"
set "normalized_title=%normalized_title:W=w%"
set "normalized_title=%normalized_title:X=x%"
set "normalized_title=%normalized_title:Y=y%"
set "normalized_title=%normalized_title:Z=z%"

echo 规范化后的标题: %normalized_title%
echo.
echo 请选择要创建的项目:
echo   1. Paper Guide
echo   2. Paper Express
echo.
set /p choice=请输入选项 (1/2): 
echo.

set "express_dir=paper-express\papers\%normalized_title%"
set "guide_dir=paper-guide\papers\%normalized_title%"

if "%choice%"=="1" goto create_guide
if "%choice%"=="2" goto create_express

echo 无效选项！
goto end

:create_guide
if not exist "%guide_dir%" (
    mkdir "%guide_dir%"
    echo 创建目录: %guide_dir%
)
if not exist "%guide_dir%\notes" (
    mkdir "%guide_dir%\notes"
    echo 创建目录: %guide_dir%\notes
)

(
echo ---
echo title: "%paper_title%"
echo authors: ["Author Name"]
echo date: "2024-01-01"
echo tags: ["Tag1", "Tag2"]
echo venue: "Conference/Journal"
echo pdf_url: "#"
echo code_url: "#"
echo editor: "Editor Name"
echo editor_note: ["编者按第一段", "编者按第二段"]
echo digest_pub_time: "2026-02-20"
echo ---
echo.
echo # %paper_title%
echo.
echo ## 摘要
echo.
echo ## 引言
echo.
echo ## 方法
echo.
echo ## 实验
echo.
echo ## 结论
) > "%guide_dir%\%normalized_title%.md"
echo 创建模板文件: %guide_dir%\%normalized_title%.md
goto end

:create_express
if not exist "%express_dir%" (
    mkdir "%express_dir%"
    echo 创建目录: %express_dir%
)
if not exist "%express_dir%\notes" (
    mkdir "%express_dir%\notes"
    echo 创建目录: %express_dir%\notes
)

(
echo ---
echo title: "%paper_title%"
echo authors: ["Author Name"]
echo date: "2024-01-01"
echo tags: ["Tag1", "Tag2"]
echo venue: "Conference/Journal"
echo pdf_url: "#"
echo code_url: "#"
echo editor: "Editor Name"
echo editor_note: ["编者按第一段", "编者按第二段"]
echo digest_pub_time: "2026-02-20"
echo ---
echo.
echo # %paper_title%
echo.
echo ## 摘要
echo.
echo ## 引言
echo.
echo ## 方法
echo.
echo ## 实验
echo.
echo ## 结论
) > "%express_dir%\%normalized_title%.md"
echo 创建模板文件: %express_dir%\%normalized_title%.md
goto end

:end
echo.
echo ========================================
echo   完成！
echo ========================================
echo.
pause
