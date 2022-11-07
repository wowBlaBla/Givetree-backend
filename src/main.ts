import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port");
  const app_env = configService.get<string>("app.env");
  const cors_frontend_origin =
    configService.get<string>("app.corsOrigin") || "*";

  app.enableCors({
    origin: cors_frontend_origin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: false,
    optionsSuccessStatus: 204,
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
