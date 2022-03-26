import * as mongoose from 'mongoose';

export const challengeSchema = new mongoose.Schema(
  {
    challengeTime: { type: Date },
    status: { type: String },
    requestTime: { type: Date, default: Date.now() },
    responseTime: { type: Date },
    challenger: { type: mongoose.Schema.Types.ObjectId },
    category: { type: mongoose.Schema.Types.ObjectId },
    players: [{ type: mongoose.Schema.Types.ObjectId }],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
