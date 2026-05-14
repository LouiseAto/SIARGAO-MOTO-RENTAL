# Manual Fix Commands

Run these commands in your Git Bash terminal, one at a time:

## Step 1: Navigate to the project folder
```bash
cd /c/FINALS\ IT382/siargao-moto-rental
```

## Step 2: Set up branch tracking
```bash
git branch --set-upstream-to=origin/master master
```

## Step 3: Pull remote changes
```bash
git pull origin master
```

## Step 4: Add your changes
```bash
git add .
```

## Step 5: Commit your changes
```bash
git commit -m "fix: improve logout functionality - properly clear session and redirect to landing page"
```

## Step 6: Push to GitHub
```bash
git push origin master
```

---

## If Step 3 (git pull) shows merge conflicts:

1. Git will tell you which files have conflicts
2. Open each conflicted file
3. Look for these markers:
   ```
   <<<<<<< HEAD
   Your local changes
   =======
   Remote changes from GitHub
   >>>>>>> origin/master
   ```
4. Choose which version to keep (or combine them)
5. Delete the markers (`<<<<<<<`, `=======`, `>>>>>>>`)
6. Save the file
7. Run:
   ```bash
   git add .
   git commit -m "Merge remote changes"
   git push origin master
   ```

---

## Alternative: Use the automated script

Instead of running commands manually, just run:
```bash
cd /c/FINALS\ IT382/siargao-moto-rental
./fix-and-deploy.bat
```

This will do all the steps automatically.
