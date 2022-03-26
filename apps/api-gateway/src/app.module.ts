import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersController } from './players/players.controller';
import { PlayersModule } from './players/players.module';
import { RMQModule } from './client-proxy/rmq.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengesModule } from './challenges/challenges.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    CategoriesModule,
    PlayersModule,
    RMQModule,
    AwsModule,
    ChallengesModule,
    RankingsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
