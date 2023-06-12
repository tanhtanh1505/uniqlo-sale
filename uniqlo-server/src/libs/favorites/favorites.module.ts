import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteSchema } from 'src/schemas/favorite.schema';
import { FavoritesService } from './favorites.services';
import { FavoriteController } from './favorites.controller';
import { UsersModule } from '../users/users.module';
import { ClothesModule } from '../clothes/clothes.module';

@Module({
  imports: [
    UsersModule,
    ClothesModule,
    MongooseModule.forFeature([{ schema: FavoriteSchema, name: 'Favorite' }]),
  ],
  controllers: [FavoriteController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
