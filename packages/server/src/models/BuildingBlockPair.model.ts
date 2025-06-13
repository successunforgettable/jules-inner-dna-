import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for the BuildingBlock sub-document
export interface IBuildingBlock extends Document {
  blockId: string; // e.g., "t1_w9_a", unique within the pair
  content: string;
  textureVariation?: string;
  // Fields for algorithm processing, based on client-side buildingBlockData.ts
  associatedWingValue?: number;
  arrowDirection?: 'integration' | 'disintegration';
  choiceValue?: number | string; // For generic pairs
  // gradientStyle from client-side buildingBlockData.ts could be stored if needed server-side
}

const BuildingBlockSchema: Schema<IBuildingBlock> = new Schema<IBuildingBlock>({
  blockId: { type: String, required: true },
  content: { type: String, required: true },
  textureVariation: { type: String },
  associatedWingValue: { type: Number },
  arrowDirection: { type: String, enum: ['integration', 'disintegration'] },
  choiceValue: { type: Schema.Types.Mixed }, // Can be number or string
}, { _id: false });

// Interface for the BuildingBlockPair document
export interface IBuildingBlockPair extends Document {
  pairId: string; // Globally unique, e.g., "type1_wing_pair", "generic_growth_focus"
  questionText: string;
  pairType: 'wing' | 'arrow' | 'growth_focus' | 'response_pattern';
  enneagramType?: string; // "1"-"9" for type-specific pairs (wing, arrow), null/absent for generic
  blocks: [IBuildingBlock, IBuildingBlock]; // Tuple of 2 IBuildingBlock sub-documents
  createdAt: Date;
  updatedAt: Date;
}

const BuildingBlockPairSchema: Schema<IBuildingBlockPair> = new Schema<IBuildingBlockPair>({
  pairId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  pairType: {
    type: String,
    required: true,
    enum: ['wing', 'arrow', 'growth_focus', 'response_pattern'],
  },
  enneagramType: { // Optional, only for type-specific pairs
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", null], // Allow null for generic
    default: null,
  },
  blocks: {
    type: [BuildingBlockSchema],
    required: true,
    validate: [ // Ensure there are exactly 2 blocks
      (val: IBuildingBlock[]) => val.length === 2,
      '{PATH} must contain exactly 2 building blocks.'
    ]
  },
}, { timestamps: true });

// Compound index for querying type-specific pairs
BuildingBlockPairSchema.index({ enneagramType: 1, pairType: 1 });

const BuildingBlockPair: Model<IBuildingBlockPair> = mongoose.model<IBuildingBlockPair>('BuildingBlockPair', BuildingBlockPairSchema);

export default BuildingBlockPair;
```
