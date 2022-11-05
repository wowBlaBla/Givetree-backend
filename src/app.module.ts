import { ConfigModule, ConfigService } from "@nestjs/config";
import { RequestMethod } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MikroOrmMiddleware, MikroOrmModule } from "@mikro-orm/nestjs";
import {
  Module,
  MiddlewareConsumer,
  NestModule,
  OnModuleInit,
} from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import configuration from "./config/configuration";
import { UsersModule } from "./users/users.module";
import { SocialsController } from "./socials/socials.controller";
import { SocialsModule } from "./socials/socials.module";
import { CharityModule } from "./charity/charity.module";
import { CollectionsModule } from "./collections/collections.module";
import { SalesModule } from "./sales/sales.module";
import { DonationsModule } from "./donations/donations.module";
import { SentryModule } from "./sentry/sentry.module";
import * as Sentry from "@sentry/node";
import "@sentry/tracing";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // SentryModule.forRoot({
    //   dsn: process.env.SENTRY_DNS,
    //   environment: process.env.APP_ENV,
    //   release: "givetree-backend@" + process.env.APP_COMMIT_SHA_SHORT,
    //   tracesSampleRate: 1.0,
    //   debug: false,
    // }),
    MikroOrmModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        installSubscriptionHandlers: true,
        autoSchemaFile: "schema.gql",
        cors: {
          origin: configService.get<string>("CORS_FRONTEND_ORIGIN"),
          credentials: true,
        },
      }),
    }),
    UsersModule,
    AuthModule,
    SocialsModule,
    CharityModule,
    CollectionsModule,
    SalesModule,
    DonationsModule,
    // SentryModule,
  ],
  controllers: [AppController, SocialsController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    // await this.orm.getMigrator().up();
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Sentry.Handlers.requestHandler(), MikroOrmMiddleware)
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      });
  }
}
