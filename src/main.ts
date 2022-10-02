import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_SERVER_PORT') || 3000;
  const app_env = configService.get<string>('APP_ENV') || "dev";
  const cors_frontend_origin = configService.get<string>('CORS_FRONTEND_ORIGIN') || "*";

  app.enableCors({
    origin: cors_frontend_origin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204
  });
  app.setGlobalPrefix("api");
  
  const config = new DocumentBuilder()
    .setTitle("GiveTree API")
    .setDescription("API for the GiveTree.")
    .setVersion("1.0")
    .addTag("givetree")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  configService.get<string>("auth.jwtKey"),

  app_env == "dev" ? SwaggerModule.setup("api", app, document) : null;

  await app.listen(port);
}
bootstrap();
