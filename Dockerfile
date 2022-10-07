FROM node:16.17-alpine3.15 AS build-env

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
COPY .env.example ./.env

RUN yarn build

# Build runtime image
FROM node:16.17-alpine3.15

# Hard-bake full commit sha into container env
ARG COMMIT_SHA
ENV APP_COMMIT_SHA=${COMMIT_SHA}

# Hard-bake short commit sha into container env
ARG COMMIT_SHA_SHORT
ENV APP_COMMIT_SHA_SHORT=${COMMIT_SHA_SHORT}

WORKDIR /usr/src/app

COPY --from=build-env /usr/src/app/.env /usr/src/app/.env

COPY --from=build-env /usr/src/app/package.json /usr/src/app/package.json
COPY --from=build-env /usr/src/app/yarn.lock /usr/src/app/yarn.lock
COPY --from=build-env /usr/src/app/tsconfig.json /usr/src/app/tsconfig.json
COPY --from=build-env /usr/src/app/nest-cli.json /usr/src/app/nest-cli.json
COPY --from=build-env /usr/src/app/schema.gql /usr/src/app/schema.gql

COPY --from=build-env /usr/src/app/dist /usr/src/app/dist
COPY --from=build-env /usr/src/app/src/database/entities /usr/src/app/src/database/entities
COPY --from=build-env /usr/src/app/src/database/migrations /usr/src/app/src/database/migrations
COPY --from=build-env /usr/src/app/node_modules /usr/src/app/node_modules

CMD ["node", "dist/main.js"]

