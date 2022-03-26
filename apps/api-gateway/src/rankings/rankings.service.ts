import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../client-proxy/client-proxy';
import { Ranking } from './interfaces/ranking.interface';

@Injectable()
export class RankingsService {
  constructor(private clientProxy: ClientProxyService) {}

  private clientMicroRankings = this.clientProxy.getRankingsInstance();

  findRanking(categoryId: string, refDate?: string): Observable<Ranking> {
    if (!categoryId) throw new BadRequestException('Category Id is required');
    return this.clientMicroRankings.send('find-ranking', {
      categoryId,
      refDate,
    });
  }
}
