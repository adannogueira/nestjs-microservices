import { Module } from '@nestjs/common';
import { RMQModule } from '../client-proxy/rmq.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  imports: [RMQModule],
  exports: [CategoriesModule],
  providers: [CategoriesService],
})
export class CategoriesModule {}
