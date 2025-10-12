@echo off
git add .

set /p commitMessage="Enter commit message: "

if "%commitMessage%"=="" (
    git commit -m "chore: update files"
) else (
    git commit -m "%commitMessage%"
)

git push origin main
