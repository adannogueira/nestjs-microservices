import { Document } from 'mongoose';
import { Category } from '../../categories/interfaces/Category.interface';

export interface Player extends Document {
  readonly phone: string;
  readonly email: string;
  name: string;
  ranking: string;
  rankPosition: number;
  photoUrl: string;
  category: Category;
}
