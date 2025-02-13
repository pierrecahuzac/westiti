import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import path from 'path';
import helmet from 'helmet';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './certs', 'cert.pem')),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.use(cookieParser());
  app.enableCors({
    origin: ['https://localhost:5173'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],  // Autorise uniquement les ressources locales
          scriptSrc: ["'self'", "https://localhost:5173"], // Autorise certains domaines pour les scripts
          styleSrc: ["'self'", "https://localhost:5173"], // Idem pour les styles
        },
      },
      
      hidePoweredBy:true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Améliore la confidentialité des requêtes
      xssFilter: true, // Active la protection contre les attaques XSS
      frameguard: { action: "deny" }, // Empêche l'affichage dans un <iframe>
    })
  );
  const config = new DocumentBuilder()
    .setTitle('WeStiti API')
    .setDescription('WeStiti description')
    .setVersion('0.0.1')
    .addTag('westiti')
    .build();
  /* const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory); */

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
