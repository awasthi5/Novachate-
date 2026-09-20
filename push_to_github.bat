@echo off
title Push NOVACHATE to GitHub
echo ===================================================
echo Pushing NOVACHATE to GitHub Repository...
echo URL: https://github.com/awasthi5/Novachate-.git
echo ===================================================
echo.

cd /d "%~dp0"
git push -u origin main --force

echo.
if %errorlevel% equ 0 (
    echo ===================================================
    echo [SUCCESS] Code pushed successfully to GitHub!
    echo Check: https://github.com/awasthi5/Novachate-
    echo ===================================================
) else (
    echo ===================================================
    echo [ERROR] Push failed. If a browser window opened,
    echo please click Authorize to sign in with GitHub.
    echo ===================================================
)
pause
