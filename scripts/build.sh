docker compose up -d

if [ -f uniqlo-server-prod.tar ]; then
    rm uniqlo-server-prod.tar
fi

docker save uniqlo-server-prod > uniqlo-server-prod.tar