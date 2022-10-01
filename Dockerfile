FROM node:16.17-bullseye-slim

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

COPY .env.example ./.env

RUN yarn build

CMD ["node", "dist/main.js"]