import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';
import passport from 'passport';
import session from 'express-session';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.setGlobalPrefix('/uniqlo/api');
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableCors();

  logger.debug(process.env.PORT);

  const config = new DocumentBuilder()
    .setTitle('Uniqlo Crawler API')
    .setDescription('The Uniqlo Crawler API description')
    .setVersion('1.1.0')
    .addTag('clothes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/uniqlo/api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
