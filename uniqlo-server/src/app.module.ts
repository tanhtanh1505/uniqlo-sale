import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClothesModule } from './libs/clothes/clothes.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { LoggerMiddleware } from './common/middleware';
import { ClothesController } from './libs/clothes/clothes.controller';
import { UsersModule } from './libs/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { CronModule } from './libs/cron/cron.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlsModule } from './libs/urls/urls.module';
import { AuthModule } from './libs/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { FavoritesModule } from './libs/favorites/favorites.module';
import { RolesGuard } from './utils/roles/role.guard';
import { AuthGuard } from './libs/auth/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggersModule } from './libs/loggers/loggers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    ClothesModule,
    CronModule,
    MailModule,
    UrlsModule,
    FavoritesModule,
    LoggersModule,
    PassportModule.register({ session: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'build'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ClothesController);
  }
}
