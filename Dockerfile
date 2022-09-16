FROM node:14.17.0

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

COPY .env.prod ./.env

RUN yarn build

CMD ["node", "dist/main.js"]