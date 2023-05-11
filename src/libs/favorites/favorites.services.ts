import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFavoriteDto } from './favorites.dto';
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
    const details = await this.clothesService.crawlDetails(favorite.url);

    return await this.favoriteModel.create({
      user: req.user._id,
      code: details.code,
      title: details.title,
      ...favorite,
    });
  }

  async findAll(req): Promise<Favorite[]> {
    return await this.favoriteModel.find({ user: req.user._id });
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
