## Description

GiveTree master backend.

## Setup

- Uses code-first GraphQL
- Uses MikroORM for entities and migrations
- Implements refresh token based auth flow
- Uses PassportJS and JWT for authentication
- Custom Prettier and ESLint config
- Uses [`@jenyus-org/nestjs-graphql-utils`](https://github.com/Jenyus-Org/graphql-utils) to optimize queries and [solve the N+1 problem](https://jenyus.web.app/blog/2021-03-08-graphql-utils)

### Configuration Files

#### Environment Variables

`.env`

```env
JWT_KEY=<your-jwt-key-here>
```

#### TypeORM

`ormconfig.js`

```js
const { join } = require("path");

module.exports = {
  type: "sqlite",
  synchronize: true,
  entities: ["dist/**/*.entity.js"],
  database: "tmp/data.sqlite",
  migrations: [join(__dirname, "database", "migrations", "*.ts")],
  cli: {
    migrationsDir: "src/database/migrations",
  },
};
```

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

This boilerplate remains true to Nest and is [MIT licensed](LICENSE).

