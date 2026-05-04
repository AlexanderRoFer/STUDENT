@echo off
REM Edita REMOTE_URL abajo con la URL de tu repo remoto (HTTPS o SSH)
set REMOTE_URL=
if "%REMOTE_URL%"=="" (
  echo Please set REMOTE_URL in this file before running.
  pause
  exit /b 1
)

cd /d "%~dp0"
git init
git add -A
git commit -m "chore: initial commit - migrate from local workspace" || echo No changes to commit
git remote add origin %REMOTE_URL% || echo Remote already exists
git branch -M main
git push -u origin main
echo Done.
pause
