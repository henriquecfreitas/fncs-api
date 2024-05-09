import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import { AppModule } from "./modules/app/app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle("Expenses API")
    .setDescription("Mock API for expenses management")
    .setVersion("1.0.0")
    .addTag("Auth")
    .addTag("Users")
    .addTag("Expenses")
    .addBasicAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    })
    .build()
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
  })

  SwaggerModule.setup("api-spec", app, document)

  await app.listen(3000)
}

bootstrap()
