import * as mongoose from 'mongoose';

export const matchSchema = new mongoose.Schema(
  {
    challenge: { type: mongoose.Schema.Types.ObjectId },
    category: { type: mongoose.Schema.Types.ObjectId },
    winner: { type: mongoose.Schema.Types.ObjectId },
    result: [{ set: { type: String } }],
    players: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true, collection: 'matches' },
);
