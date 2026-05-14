@echo off
echo ========================================
echo Deploying Siargao Moto Rental to Vercel
echo ========================================
echo.

echo Checking git status...
git status
echo.

echo Pulling latest changes from remote...
git pull origin master
echo.

echo Adding all changes...
git add .
echo.

echo Committing changes...
git commit -m "fix: improve logout functionality - properly clear session and redirect to landing page"
echo.

echo Pushing to repository...
git push origin master
echo.

echo ========================================
echo Deployment initiated!
echo Check Vercel dashboard for deployment status
echo ========================================
pause
