import { IsEnum, IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  @IsEnum(ChallengeStatus)
  readonly status: ChallengeStatus;
}
