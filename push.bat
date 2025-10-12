@echo off
cd /d %~dp0

echo.
echo [ Git Push - topstack-site ]
echo ------------------------------------------

git add .

set /p commitMessage="Enter commit message: "

if "%commitMessage%"=="" (
    git commit -m "chore: update files"
) else (
    git commit -m "%commitMessage%"
)

echo.
echo Pushing to origin main...
git push origin main --force

echo.
echo [V] Push completed.
pause
