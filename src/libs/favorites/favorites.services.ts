import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFavoriteDto } from './favorites.dto';
import { Favorite } from 'src/entity/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel('Favorite') private favoriteModel: Model<Favorite>,
  ) {}

  async create(req, favorite: CreateFavoriteDto): Promise<Favorite> {
    return await this.favoriteModel.create({ user: req.user._id, ...favorite });
  }

  async findAll(): Promise<Favorite[]> {
    return await this.favoriteModel.find();
  }
}
