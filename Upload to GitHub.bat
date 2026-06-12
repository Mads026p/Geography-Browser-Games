@echo off
cd /d "%~dp0"

echo ================================
echo Uploading latest changes to GitHub
echo ================================
echo.

git status
echo.

git add .

git commit -m "Update game"

git push

echo.
echo ================================
echo Done. Check above for errors.
echo ================================
pause