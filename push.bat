@echo off
cd /d %~dp0

REM --- Informações do Repositório ---
set REPO_URL=https://github.com/TOPSTACK-BR/website.git
set GIT_USER_NAME="TOPSTACK-BR"
set GIT_USER_EMAIL="topstack1074@gmail.com"


echo.
echo [ Git Config + Push - topstack-site ]
echo ------------------------------------------

git config user.name %GIT_USER_NAME%
git config user.email %GIT_USER_EMAIL%

git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

git add .

set /p commitMessage="Enter commit message: "

if "%commitMessage%"=="" (
    git commit -m "chore: update files"
) else (
    git commit -m "%commitMessage%"
)

git branch -M main

echo.
echo Pushing to origin main...
git push origin main --force

echo.
echo [V] Push completed.
pause
