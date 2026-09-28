@echo off
cd /d C:\laragon\www\tcgm-backend
echo ============================ >> schedule_log.txt
echo [START] %DATE% %TIME% >> schedule_log.txt
"C:\laragon\bin\php\php-8.3.15-nts-Win32-vs16-x64\php.exe" artisan schedule:run >> schedule_log.txt 2>&1
echo [END] %DATE% %TIME% >> schedule_log.txt
echo ============================ >> schedule_log.txt
