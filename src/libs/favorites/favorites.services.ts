import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompareFavoriteDto,
  CompareResponseDto,
  CreateFavoriteDto,
  FavoriteResponseDto,
} from './favorites.dto';
import { Favorite } from 'src/entity/favorite.entity';
import { UsersService } from '../users/users.service';
import { ClothesService } from '../clothes/clothes.services';
import { Cloth } from 'src/entity';

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
      const cloth = await this.clothesService.findByCode(favorite.code);
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

  async scan(): Promise<Favorite[]> {
    const users = await this.userService.findAll();
    const clothes = await this.clothesService.findAll();
    const res: Favorite[] = [];
    for (const user of users) {
      const favorites = await this.favoriteModel.find({ user: user });
      for (const favorite of favorites) {
        console.log('SCAN', favorite);
        const exist = await this.check(clothes, favorite);
        if (exist) res.push(favorite);
      }
    }
    return res;
  }

  async check(clothes: Cloth[], favourite: Favorite): Promise<boolean> {
    for (const cloth of clothes) {
      if (cloth.code != favourite.code) {
        continue;
      }
      for (const sizeColor of cloth.sizeColor) {
        const { color, size, price } = sizeColor;

        if (
          favourite.size == size &&
          favourite.color == color &&
          favourite.price >= price
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
