import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.services';
import { CreateFavoriteDto } from './favorites.dto';
import { Favorite } from 'src/entity/favorite.entity';

@ApiBearerAuth()
@ApiTags('favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoritesService) {}

  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({ status: 200 })
  @Get('all')
  async getAllFavorite(): Promise<Favorite[]> {
    return await this.favoriteService.findAll();
  }

  @ApiOperation({ summary: 'Add favorite' })
  @ApiResponse({ status: 200 })
  @Post('add')
  async addFavorite(
    @Body() createFavorite: CreateFavoriteDto,
    @Req() req,
  ): Promise<Favorite> {
    return await this.favoriteService.create(req, createFavorite);
  }
}
