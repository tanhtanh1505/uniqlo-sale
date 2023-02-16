cd ~/uniqlo

docker load -i uniqlo-server-prod.tar

docker image frune -f

docker compose up -d

docker logs -f uniqlo_server_prod