echo "Deploying application ..."

cd ~/FRP

git reset --hard origin/main

git pull origin main

pm2 stop frp

npm install

pm2 restart frp