import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';
import { Category } from './interfaces/Category.interface';
import { CategoriesService } from './categories.service';
import { AcknowledgementEmitter } from '../shared/acknowledgement.emitter';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private readonly logger = new Logger(CategoriesController.name);

  //For an event based microservice route, use the @EventPattern decorator
  @EventPattern('create-category') // to subscribe to the emitter topic
  async createCategory(
    // As we're dealing with broker based comunication, we receive no request, but a payload
    @Payload() category: Category,
    // We are able to get metadata in the context too
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.logger.log(`Category: ${JSON.stringify(category)}`);

    try {
      await this.categoriesService.createCategory(category);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('list-categories') // to subscriber to the responder topic
  async listCategories(@Ctx() context: RmqContext): Promise<Category[]> {
    const categories = await this.categoriesService.listCategories();
    await AcknowledgementEmitter.emit(context);
    return categories;
  }

  @MessagePattern('find-category')
  async findCategoryById(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const category = await this.categoriesService.findCategoryById(id);
    await AcknowledgementEmitter.emit(context);
    return category;
  }

  @MessagePattern('find-category-by-player')
  async findCategoryByPlayerId(
    @Payload() playerId: string,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const category = await this.categoriesService.findCategoryByPlayerId(
      playerId,
    );
    await AcknowledgementEmitter.emit(context);
    return category;
  }

  @EventPattern('update-category')
  async updateCategory(
    @Payload() data: { id: string; category: Category },
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      const { id, category } = data;
      await this.categoriesService.updateCategory(id, category);
      await AcknowledgementEmitter.emit(context);
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }

  @MessagePattern('delete-category')
  async deleteCategory(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    try {
      const category = await this.categoriesService.deleteCategory(id);
      await AcknowledgementEmitter.emit(context);
      return category;
    } catch (err) {
      await AcknowledgementEmitter.emit(context, err);
    }
  }
}
