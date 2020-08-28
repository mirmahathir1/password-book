
echo "Enter commit message: "
read -r message
echo "The commit message is: $message"

git add .
git commit -am "$message"
git push origin master

npm run build
firebase deploy
npx cap sync
#vue add electron-builder
#npm run electron:build
# npm run electron:build -- --win
#https://www.electron.build/multi-platform-build#linux
