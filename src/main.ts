import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ["content-type", "authorization"],
    origin: "http://localhost:3000",
    credentials: true,
  });
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Recog")
    .setDescription("API for the Recog Swiss school forum.")
    .setVersion("1.0")
    .addTag("forum")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3001);
}
bootstrap();
