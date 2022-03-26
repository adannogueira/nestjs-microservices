import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ParametersValidator } from '../common/pipes/parameters-validator.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/Category.interface';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  private logger = new Logger(CategoriesController.name);

  /**
   * As we're dealing with synchronous code here, there's no need to await anything,
   * if the message broker service is online, the emit method called here will be
   * stored there until the receiving end gets and deals with it.
   */
  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto): void {
    this.logger.log(`Creating category ${createCategoryDto.category}.`);
    this.categoriesService.createCategory(createCategoryDto);
  }

  /**
   * The send method work differently from the emit, it will await for an observable
   * if, for any reason, the microservice is inactive, the route will keep awaiting
   * for the response.
   */
  @Get(':categoryId')
  findCategoryById(
    @Param('categoryId', ParametersValidator) categoryId: string,
  ): Observable<Category> {
    this.logger.log(`Searching category by id: ${categoryId}.`);
    return this.categoriesService.findCategoryById(categoryId);
  }

  @Get()
  listCategories(): Observable<Category[]> {
    this.logger.log('Listing all active categories');
    return this.categoriesService.listCategories();
  }

  @Get('players/:playerId')
  findCategoryByPlayerId(
    @Param('playerId', ParametersValidator) playerId: string,
  ): Observable<Category> {
    this.logger.log(`Searching player's category, player id: ${playerId}.`);
    return this.categoriesService.findCategoryByPlayerId(playerId);
  }

  @Put(':categoryId')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Param('categoryId', ParametersValidator) categoryId: string,
    @Body() categoryUpdateData: UpdateCategoryDto,
  ): void {
    this.logger.log(`Updating category of id: ${categoryId}.`);
    this.categoriesService.updateCategory(categoryId, categoryUpdateData);
  }

  @Delete(':categoryId')
  deleteCategory(
    @Param('categoryId', ParametersValidator) categoryId: string,
  ): Observable<Category> {
    this.logger.log(`Deleting category of id: ${categoryId}.`);
    return this.categoriesService.deleteCategory(categoryId);
  }
}
