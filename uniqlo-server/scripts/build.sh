if [ -f uniqlo-server-prod.tar ]; then
    bash scripts/remove.sh
fi


cd ../uniqlo-client
sed -i 's/http:\/\/localhost:8000/https:\/\/saletoday.info/g' .env
npm run build
sed -i 's/https:\/\/saletoday.info/http:\/\/localhost:8000/g' .env

cp -r build ../uniqlo-server/

cd ../uniqlo-server

docker compose up -d

docker save uniqlo-server-prod > uniqlo-server-prod.tar