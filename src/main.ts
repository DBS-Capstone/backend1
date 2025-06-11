import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();

    // Serve static files
    app.useStaticAssets(join(__dirname, '..', 'public'));

    // Setup Swagger
    const config = new DocumentBuilder()
    .setTitle('Kicau Finder API')
    .setDescription('API for Kicau Finder - Bird Identification and Birdpedia')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
