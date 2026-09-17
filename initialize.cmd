@echo off
setlocal

REM Run the bootstrap script with a process-local execution policy override.
REM This does not change the machine-wide or user-wide PowerShell policy.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0initialize.ps1" %*
endlocal & exit /b %ERRORLEVEL%
