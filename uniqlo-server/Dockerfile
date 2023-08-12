FROM node:16-alpine AS build

WORKDIR /src

COPY package.json ./

COPY . .

RUN npm install

RUN npm run build

FROM node:16-slim

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /src/tsconfig.json ./tsconfig.json
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/dist ./dist
COPY --from=build /src/.puppeteerrc.cjs ./.puppeteerrc.cjs
COPY --from=build /src/.cache ./.cache
COPY --from=build /src/build ./build

ENTRYPOINT ["node", "dist/main.js"]