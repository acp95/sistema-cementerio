import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global de API (excluir Swagger)
  app.setGlobalPrefix('api', {
    exclude: ['api-docs', 'api-docs/(.*)'],
  });

  // Configurar CORS para Angular
  // Permitir conexiones desde cualquier origen (para acceso en red local)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma tipos automáticamente
    }),
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Cementerio Municipal')
    .setDescription(
      'API REST para la gestión integral de cementerios municipales. ' +
      'Incluye módulos de autenticación, infraestructura, registro de difuntos y caja.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('sectores', 'Gestión de sectores del cementerio')
    .addTag('espacios', 'Gestión de nichos y fosas')
    .addTag('titulares', 'Gestión de titulares/responsables')
    .addTag('difuntos', 'Registro de personas fallecidas')
    .addTag('inhumaciones', 'Gestión de inhumaciones')
    .addTag('conceptos-pago', 'Conceptos de pago disponibles')
    .addTag('pagos', 'Gestión de pagos y recibos')
    .addBearerAuth() // Para futuro uso con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Escuchar en todas las interfaces de red (0.0.0.0) para acceso en red local
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en: http://0.0.0.0:${process.env.PORT ?? 3000}`);
  console.log(`📚 Documentación Swagger: http://localhost:${process.env.PORT ?? 3000}/api-docs`);
  console.log(`🌐 Accesible en red local usando la IP de esta PC`);
}
bootstrap();
