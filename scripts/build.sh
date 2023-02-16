docker compose up -d

#save new image to file tar
rm uniqlo-server-prod.tar
docker save uniqlo-server-prod > uniqlo-server-prod.tar