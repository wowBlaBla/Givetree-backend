import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_SERVER_PORT') || 3000;
  const app_env = configService.get<string>('APP_ENV') || "dev";

  const config = new DocumentBuilder()
    .setTitle("GiveTree API")
    .setDescription("API for the GiveTree.")
    .setVersion("1.0")
    .addTag("givetree")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  configService.get<string>("auth.jwtKey"),

  app_env != "prod" ? SwaggerModule.setup("api", app, app_env != "prod" ? document : null) : null;

  await app.listen(port);
}
bootstrap();
