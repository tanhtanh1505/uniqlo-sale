FROM node:16-alpine AS build

WORKDIR /src

COPY package.json ./

COPY . .

RUN npm install

RUN npm run build

FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /src/tsconfig.json ./tsconfig.json
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/dist ./dist

ENTRYPOINT ["node", "dist/main.js"]