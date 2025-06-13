import mongoose, { Schema, Document } from 'mongoose';

export interface IEnneagramType extends Document {
  name: string; // e.g., "Type 1"
  number: number; // e.g., 1
  nickname: string; // e.g., "The Reformer"
  description: string; // Detailed description
  coreFear: string;
  coreDesire: string;
  keyMotivations: string;
  virtue: string;
  vice: string;
  affirmation: string;
  motto: string;
  colorHex: string; // Associated primary color
  imageSymbolUrl?: string; // URL to an associated symbol/image
  foundationStonePrompt?: string; // Text for the foundation stone selection (if generic per type)
  wingDescription?: string; // Generic description about how wings work for this type
  arrowsDescription?: string; // Generic description about how arrows work for this type
  stressGrowthDescription?: string; // General notes on stress/growth
  createdAt: Date;
  updatedAt: Date;
}

const EnneagramTypeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    number: { type: Number, required: true, unique: true, min: 1, max: 9 },
    nickname: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coreFear: { type: String, required: true },
    coreDesire: { type: String, required: true },
    keyMotivations: { type: String, required: true }, // Could be an array of strings
    virtue: { type: String, required: true },
    vice: { type: String, required: true },
    affirmation: { type: String, required: true },
    motto: { type: String, required: true },
    colorHex: { type: String, required: true }, // Validate as hex?
    imageSymbolUrl: { type: String, trim: true },
    foundationStonePrompt: { type: String },
    wingDescription: { type: String },
    arrowsDescription: { type: String },
    stressGrowthDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEnneagramType>('EnneagramType', EnneagramTypeSchema);
