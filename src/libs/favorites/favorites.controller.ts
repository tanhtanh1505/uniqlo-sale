import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.services';
import {
  CompareFavoriteDto,
  CompareResponseDto,
  CreateFavoriteDto,
} from './favorites.dto';
import { Favorite } from 'src/entity/favorite.entity';
import { Roles } from 'src/utils/roles/role.decorator';
import { Role } from 'src/utils/roles/role.enum';

@Roles(Role.User)
@ApiBearerAuth()
@ApiTags('favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoritesService) {}

  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({ status: 200 })
  @Get('all')
  async getAllFavorite(@Req() req): Promise<Favorite[]> {
    return await this.favoriteService.findAll(req);
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

  @ApiOperation({ summary: 'Delete favorite' })
  @ApiResponse({ status: 200 })
  @Delete('delete')
  async deleteFavorite(
    @Query() createFavorite: CreateFavoriteDto,
    @Req() req,
  ): Promise<boolean> {
    return await this.favoriteService.delete(req, createFavorite);
  }

  @ApiOperation({ summary: 'Scan' })
  @ApiResponse({ status: 200, type: [Favorite] })
  @Get('scan')
  async scan(): Promise<Favorite[]> {
    return await this.favoriteService.scan();
  }

  @ApiOperation({ summary: 'Compare' })
  @ApiResponse({ status: 200, type: Boolean })
  @Get('compare')
  async compare(
    @Req() req,
    @Query() favorite: CompareFavoriteDto,
  ): Promise<CompareResponseDto> {
    return await this.favoriteService.compare(req, favorite);
  }
}
