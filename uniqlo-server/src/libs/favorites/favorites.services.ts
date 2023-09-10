import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompareFavoriteDto,
  CompareResponseDto,
  CreateFavoriteDto,
  FavoriteResponseDto,
  FavoriteScanResDto,
} from './favorites.dto';
import { Favorite } from 'src/entity/favorite.entity';
import { UsersService } from '../users/users.service';
import { ClothesService } from '../clothes/clothes.services';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel('Favorite') private favoriteModel: Model<Favorite>,
    private readonly userService: UsersService,
    private readonly clothesService: ClothesService,
  ) {}

  async create(req, favorite: CreateFavoriteDto): Promise<Favorite> {
    //find cloth, if not exist, create new
    const cloth = await this.favoriteModel.findOne({
      code: favorite.code,
      color: favorite.color,
      size: favorite.size,
    });

    if (cloth) {
      if (cloth.price != favorite.price) {
        cloth.price = favorite.price;
        await cloth.save();
      }
      return cloth;
    }

    return await this.favoriteModel.create({
      user: req.user._id,
      ...favorite,
    });
  }

  async delete(req, favorite: CreateFavoriteDto): Promise<boolean> {
    await this.favoriteModel.findOneAndDelete({
      user: req.user._id,
      code: favorite.code,
      color: favorite.color,
      size: favorite.size,
    });

    return true;
  }

  async compare(
    req,
    favorite: CompareFavoriteDto,
  ): Promise<CompareResponseDto> {
    const cloth = await this.favoriteModel.findOne({
      code: favorite.code,
      color: favorite.color,
      size: favorite.size,
    });

    if (!cloth)
      return {
        exist: false,
        price: 0,
      };
    return {
      exist: true,
      price: cloth.price,
    };
  }

  async findAll(req): Promise<FavoriteResponseDto[]> {
    const res: FavoriteResponseDto[] = [];
    const listFavorite = await this.favoriteModel.find({ user: req.user._id });
    for (const favorite of listFavorite) {
      const cloth = await this.clothesService.crawlDetails(favorite.code);
      const sizeColor = cloth.sizeColor.find(
        (sizeColor) =>
          sizeColor.color == favorite.color && sizeColor.size == favorite.size,
      );

      res.push({
        curPrice: cloth.price,
        curSalePrice: sizeColor.price,
        code: cloth.code,
        color: favorite.color,
        size: favorite.size,
        price: favorite.price,
        title: cloth.title,
        image: cloth.image,
        person: cloth.person,
        sale: sizeColor.sale,
        url: cloth.url,
      });
    }
    return res;
  }

  async scan(): Promise<FavoriteScanResDto[]> {
    const users = await this.userService.findAll();

    const res: FavoriteScanResDto[] = [];
    for (const user of users) {
      const favorites = await this.favoriteModel.find({ user: user });

      const saleCloths: Favorite[] = [];
      for (const favorite of favorites) {
        const exist = await this.clothesService.checkIfExist(
          favorite.code,
          true,
          favorite.color,
          favorite.size,
          favorite.price,
        );
        if (exist) saleCloths.push(favorite);
      }

      if (saleCloths.length > 0) {
        res.push({
          user: user,
          saleCloths: saleCloths,
        });
      }
    }

    return res;
  }
}
