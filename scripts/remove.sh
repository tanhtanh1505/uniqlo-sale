docker stop uniqlo_server_prod
docker rm -f uniqlo_server_prod

docker rmi -f uniqlo-server-prod:1.0.0

if [ -f uniqlo-server-prod.tar ]; then
    rm uniqlo-server-prod.tar
fi