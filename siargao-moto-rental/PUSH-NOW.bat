@echo off
echo ========================================
echo PUSHING TO GITHUB
echo ========================================
echo.
echo Repository: https://github.com/LouiseAto/SIARGAO-MOTO-RENTAL.git
echo.

echo Step 1: Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed!
    echo Make sure you're in the correct directory.
    pause
    exit /b 1
)
echo ✓ Changes added
echo.

echo Step 2: Committing changes...
git commit -m "fix: dashboard fleet status + logout + employee status - all working"
if %errorlevel% neq 0 (
    echo ERROR: Git commit failed!
    echo This might mean there are no changes to commit.
    pause
    exit /b 1
)
echo ✓ Changes committed
echo.

echo Step 3: Pushing to GitHub...
git push -f origin master
if %errorlevel% neq 0 (
    echo ERROR: Git push failed!
    echo.
    echo Trying alternative method...
    git pull origin master --allow-unrelated-histories
    git push origin master
    if %errorlevel% neq 0 (
        echo ERROR: Push still failed!
        echo Please check your internet connection and GitHub credentials.
        pause
        exit /b 1
    )
)
echo ✓ Pushed to GitHub successfully!
echo.

echo ========================================
echo SUCCESS! Code is now on GitHub
echo ========================================
echo.
echo Vercel will automatically deploy in 2-3 minutes.
echo Check: https://vercel.com/dashboard
echo.
pause
