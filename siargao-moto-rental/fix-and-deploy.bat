@echo off
echo ========================================
echo Fixing Git and Deploying to Vercel
echo ========================================
echo.

echo Setting up branch tracking...
git branch --set-upstream-to=origin/master master
echo.

echo Pulling latest changes from remote...
git pull origin master --no-rebase
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
