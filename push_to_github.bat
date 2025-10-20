@echo off
echo Fixing git issues and pushing to GitHub...
git status
git add .
git commit -m "fix: resolve conflicts and trigger deployment"
git push origin main
echo Done!
pause
