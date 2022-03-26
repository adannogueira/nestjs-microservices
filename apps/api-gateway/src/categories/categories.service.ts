import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../client-proxy/client-proxy';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/Category.interface';

@Injectable()
export class CategoriesService {
  constructor(private clientProxy: ClientProxyService) {}

  private clientAdminBackend = this.clientProxy.getAdminBackendInstance();

  createCategory(createCategoryDto: CreateCategoryDto): void {
    this.clientAdminBackend.emit(
      'create-category', // Message topic
      createCategoryDto, // Message payload
    );
  }

  findCategoryById(categoryId: string): Observable<Category> {
    return this.clientAdminBackend.send('find-category', categoryId);
  }

  listCategories(): Observable<Category[]> {
    return this.clientAdminBackend.send('list-categories', '');
  }

  findCategoryByPlayerId(playerId: string): Observable<Category> {
    return this.clientAdminBackend.send('find-category-by-player', playerId);
  }

  updateCategory(categoryId: string, category: UpdateCategoryDto): void {
    this.clientAdminBackend.emit('update-category', {
      categoryId,
      category,
    });
  }

  deleteCategory(categoryId: string): Observable<Category> {
    return this.clientAdminBackend.send('delete-category', categoryId);
  }
}
