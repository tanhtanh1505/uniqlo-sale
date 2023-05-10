import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteSchema } from 'src/schemas/favorite.schema';
import { FavoritesService } from './favorites.services';
import { FavoriteController } from './favorites.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: FavoriteSchema, name: 'Favorite' }]),
  ],
  controllers: [FavoriteController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
