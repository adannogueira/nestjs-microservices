import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { categorySchema } from './categories/interfaces/Category.schema';
import { playerSchema } from './players/interfaces/player.schema';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL_ADMIN_BACKEND, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    MongooseModule.forFeature([
      { name: 'Category', schema: categorySchema },
      { name: 'Player', schema: playerSchema },
    ]),
    CategoriesModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
