import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Ranking } from './interfaces/ranking.interface';
import { RankingsService } from './rankings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private rankingsService: RankingsService) {}

  @Get()
  findRanking(
    @Query('categoryId') categoryId: string,
    @Query('refDate') refDate: string,
  ): Observable<Ranking> {
    return this.rankingsService.findRanking(categoryId, refDate);
  }
}
