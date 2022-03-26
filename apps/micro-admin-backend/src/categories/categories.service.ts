import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExceptionLogger } from '../shared/exception.logger';
import { Category } from './interfaces/Category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  private readonly logger = new ExceptionLogger(CategoriesService.name);

  async createCategory(category: Category): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(category);
      return await createdCategory.save();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async listCategories(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async findCategoryById(id: string): Promise<Category> {
    return await this.find(id);
  }

  async findCategoryByPlayerId(playerId: string): Promise<Category> {
    const categories = await this.listCategories();

    const playerCategory = categories.find((category) =>
      category.players.find((player) => player.toString() === playerId),
    );

    if (!playerCategory)
      throw new NotFoundException('Player is not in any category.');

    return playerCategory;
  }

  async updateCategory(id: string, category: Category): Promise<void> {
    const foundCategory = await this.find(id);

    try {
      await foundCategory.updateOne(category).exec();
    } catch (err) {
      this.logger.logAndThrowException(err);
    }
  }

  async deleteCategory(id: string): Promise<Category> {
    const category = await this.find(id);

    return await category.deleteOne();
  }

  private async find(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) throw new NotFoundException('Category not found.');

    return category;
  }
}
