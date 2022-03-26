import * as mongoose from 'mongoose';

export const playerSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    ranking: { type: String },
    rankPosition: { type: Number },
    photoUrl: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true, collection: 'players' },
);
