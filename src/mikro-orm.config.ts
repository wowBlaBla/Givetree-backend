import { Logger } from "@nestjs/common";
import { Options } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { ConfigService } from "@nestjs/config";

const logger = new Logger("MikroORM");
const configService = new ConfigService( { envFilePath: '.env' });
const config = {
  type: configService.get<string>('DB_TYPE') || "mariadb",
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: configService.get<number>('DB_PORT')|| 3306,
  user: configService.get<string>('DB_USER') || "root",
  password: configService.get<string>('DB_PASSWORD') || "",
  dbName: configService.get<string>('DB_PASSWORD') || "",
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  debug: true,
  highlighter: new SqlHighlighter(),
  migrations: {
    path: "./src/database/migrations",
  },
  logger: logger.log.bind(logger),
} as Options;

export default config;

