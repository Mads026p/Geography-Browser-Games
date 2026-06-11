@echo off
setlocal
cd /d "%~dp0"
set PORT=4173
echo.
echo Starting GeoSphere on all network interfaces...
echo Local address: http://localhost:%PORT%
echo.
echo Other devices on your home network should use:
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /c:"IPv4 Address"') do echo http://%%A:%PORT%
echo.
echo Keep this window open while the game is hosted.
echo Press Ctrl+C to stop the server.
echo.
node tools\serve-local.mjs %PORT% 0.0.0.0
pause
