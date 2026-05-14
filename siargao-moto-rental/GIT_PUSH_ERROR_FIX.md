# Git Push Error Fix

## Error Message
```
! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to 'https://github.com/LouiseAto/SIARGAO-MOTO-RENTAL.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
```

## What This Means
Your local code is behind the remote repository on GitHub. Someone (or you from another computer) made changes on GitHub that you don't have locally.

## Solution Options

### Option 1: Use the New Script (RECOMMENDED)
I've created a new script that automatically pulls before pushing:

```bash
cd siargao-moto-rental
./deploy-with-pull.bat
```

This script will:
1. Pull latest changes from GitHub
2. Add your local changes
3. Commit with the message
4. Push to GitHub

### Option 2: Manual Commands
Run these commands in order:

```bash
cd siargao-moto-rental

# Pull latest changes from GitHub
git pull origin master

# Add all your changes
git add .

# Commit your changes
git commit -m "fix: improve logout functionality - properly clear session and redirect to landing page"

# Push to GitHub
git push origin master
```

### Option 3: Force Push (USE WITH CAUTION)
⚠️ **WARNING**: This will overwrite remote changes. Only use if you're sure you want to discard remote changes.

```bash
cd siargao-moto-rental
git push -f origin master
```

## What Happens During Pull

When you run `git pull origin master`, Git will:
1. Download changes from GitHub
2. Try to merge them with your local changes
3. If there are conflicts, you'll need to resolve them

## Handling Merge Conflicts

If you see merge conflicts after pulling:

1. Git will tell you which files have conflicts
2. Open those files and look for conflict markers:
   ```
   <<<<<<< HEAD
   Your local changes
   =======
   Remote changes
   >>>>>>> origin/master
   ```
3. Edit the file to keep the version you want
4. Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
5. Save the file
6. Run:
   ```bash
   git add .
   git commit -m "Merge remote changes"
   git push origin master
   ```

## Prevention

To avoid this in the future:
- Always run `git pull origin master` before starting work
- Use the `deploy-with-pull.bat` script instead of `deploy.bat`

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `git pull origin master` | Download and merge remote changes |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit staged changes |
| `git push origin master` | Upload commits to GitHub |
| `git status` | Check current state |
| `git log --oneline -5` | See last 5 commits |

---
**Recommended**: Use `deploy-with-pull.bat` for all future deployments
