if [ -f uniqlo-server-prod.tar ]; then
    bash scripts/remove.sh
fi


cd ../uniqlo-client
sed -i 's/http:\/\/localhost:8000/https:\/\/uniqlo.roofy.site/g' .env
npm run build
sed -i 's/https:\/\/uniqlo.roofy.site/http:\/\/localhost:8000/g' .env

cp -r build ../uniqlo-sale/

cd ../uniqlo-sale

docker compose up -d

docker save uniqlo-server-prod > uniqlo-server-prod.tar