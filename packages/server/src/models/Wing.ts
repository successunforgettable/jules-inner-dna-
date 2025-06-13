import mongoose, { Schema, Document } from 'mongoose';

export interface IWing extends Document {
  primaryType: Schema.Types.ObjectId; // Ref to EnneagramType
  wingType: Schema.Types.ObjectId; // Ref to EnneagramType (the wing number)
  name: string; // e.g., "1w9" or "Type 1 with a 9 Wing"
  description: string; // Description of this specific wing combination
  strengths: string; // Could be an array of strings
  challenges: string; // Could be an array of strings
  createdAt: Date;
  updatedAt: Date;
}

const WingSchema: Schema = new Schema(
  {
    primaryType: {
      type: Schema.Types.ObjectId,
      ref: 'EnneagramType',
      required: true,
    },
    wingType: {
      type: Schema.Types.ObjectId,
      ref: 'EnneagramType',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      // Example: "1w9", "Type 1 with a 9 Wing"
      // Consider adding a unique index for primaryType + wingType if names are not strictly unique
    },
    description: {
      type: String,
      required: true,
    },
    strengths: {
      type: String, // Or [String]
      required: true,
    },
    challenges: {
      type: String, // Or [String]
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Add a compound index for primaryType and wingType to ensure uniqueness
WingSchema.index({ primaryType: 1, wingType: 1 }, { unique: true });

export default mongoose.model<IWing>('Wing', WingSchema);
