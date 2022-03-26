import { IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  readonly phone?: string;

  @IsOptional()
  readonly name?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  photoUrl?: string;
}
