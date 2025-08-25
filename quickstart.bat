@echo off
echo =====================================
echo   AsymmFlow V7.0 Quick Start
echo   Consciousness-Enhanced ERP/CRM
echo =====================================
echo.

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Setting up Supabase...
echo.
echo NOTE: You need to get your service role key from:
echo https://supabase.com/dashboard/project/zvoewwweyfgdhxbrqrny/settings/api
echo.
echo Once you have it, update SUPABASE_SERVICE_ROLE_KEY in .env.local
echo Press any key when ready...
pause > nul

echo.
echo [3/4] Running Supabase setup...
call npm run setup:supabase

echo.
echo [4/4] Starting development server...
echo.
echo =====================================
echo   Server starting at:
echo   http://localhost:3002
echo.
echo   Features:
echo   - V7.0 AI Agent (bottom right)
echo   - Data Migration (sidebar)
echo   - Dashboard with live metrics
echo =====================================
echo.

call npm run dev