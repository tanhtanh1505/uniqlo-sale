docker stop uniqlo_server_prod
docker rm -f uniqlo_server_prod

docker rmi -f uniqlo-server-prod:1.0.0
rm uniqlo-server-prod.tar