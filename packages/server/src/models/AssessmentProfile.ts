import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for storing individual selections in Foundation Stone phase
interface IFoundationStoneSelection {
  setId: string; // Identifier for the stone set
  selectedStoneKey: string; // Key identifying the chosen stone (e.g., 'A', 'B', 'C')
  // Store a snapshot of type scores at the moment of selection, or after this set is completed
  typeScores: Map<string, number>;
}

// Interface for storing individual selections in Building Blocks phase
interface IBuildingBlockSelection {
  pairId: string; // Identifier for the block pair
  selectedBlockKey: string; // Key identifying the chosen block (e.g., 'A', 'B')
}

// Interface for storing individual selections in Color Palettes phase
interface IColorPaletteSelection {
  paletteId: string; // Identifier for the chosen palette (refers to OperatingState._id or a predefined key)
  choice: 'primary' | 'secondary'; // Whether this was the user's primary or secondary pick
}

export interface IAssessmentProfile extends Document {
  user: Types.ObjectId; // Ref to User
  completedDate?: Date; // Set when isComplete becomes true
  isComplete: boolean;

  // Phase 1: Foundation Stone
  foundationStoneSelections: IFoundationStoneSelection[];
  determinedCoreType?: Types.ObjectId; // Ref to EnneagramType

  // Phase 2: Building Blocks
  buildingBlockSelections: IBuildingBlockSelection[];
  determinedWing?: Types.ObjectId; // Ref to Wing (which links primaryType and wingType)
  // Or store as numbers if direct EnneagramType refs are preferred for arrows:
  determinedStressArrowTypeNumber?: number;
  determinedGrowthArrowTypeNumber?: number;

  // Phase 3: Color Palettes
  colorPaletteSelections: IColorPaletteSelection[];
  colorPaletteDistribution?: { primaryPercentage: number; secondaryPercentage: number };
  determinedOperatingStateFocus?: string; // Text summary, or could be refs to OperatingState

  // Phase 4: Detail Elements
  detailElementTokenDistribution?: { [key: string]: number }; // Flexible for container keys e.g. { selfPreservation: 4, social: 3, sexual: 3 }
  determinedInstinctualStacking?: Types.ObjectId; // Ref to InstinctualStacking

  // Phase 5: Report Meta (or results phase)
  reportGeneratedDate?: Date;
  customNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const FoundationStoneSelectionSchema: Schema = new Schema({
  setId: { type: String, required: true },
  selectedStoneKey: { type: String, required: true },
  typeScores: { type: Map, of: Number, default: {} },
}, { _id: false });

const BuildingBlockSelectionSchema: Schema = new Schema({
  pairId: { type: String, required: true },
  selectedBlockKey: { type: String, required: true },
}, { _id: false });

const ColorPaletteSelectionSchema: Schema = new Schema({
  paletteId: { type: String, required: true }, // Could be OperatingState._id.toString()
  choice: { type: String, enum: ['primary', 'secondary'], required: true },
}, { _id: false });

const AssessmentProfileSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    completedDate: { type: Date },
    isComplete: { type: Boolean, default: false, required: true },

    // Phase 1
    foundationStoneSelections: [FoundationStoneSelectionSchema],
    determinedCoreType: { type: Schema.Types.ObjectId, ref: 'EnneagramType' },

    // Phase 2
    buildingBlockSelections: [BuildingBlockSelectionSchema],
    determinedWing: { type: Schema.Types.ObjectId, ref: 'Wing' },
    determinedStressArrowTypeNumber: { type: Number, min:1, max:9 },
    determinedGrowthArrowTypeNumber: { type: Number, min:1, max:9 },

    // Phase 3
    colorPaletteSelections: [ColorPaletteSelectionSchema],
    colorPaletteDistribution: {
      primaryPercentage: { type: Number, min: 0, max: 100 },
      secondaryPercentage: { type: Number, min: 0, max: 100 },
    },
    determinedOperatingStateFocus: { type: String }, // e.g., "Primary: Calm, Secondary: Engaged"

    // Phase 4
    detailElementTokenDistribution: {
      type: Map,
      of: Number,
      // Example: { selfPreservation: 4, social: 3, oneToOne: 3 }
    },
    determinedInstinctualStacking: { type: Schema.Types.ObjectId, ref: 'InstinctualStacking' },

    // Phase 5
    reportGeneratedDate: { type: Date },
    customNotes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

AssessmentProfileSchema.pre('save', function(next) {
  if (this.isModified('isComplete') && this.isComplete && !this.completedDate) {
    this.completedDate = new Date();
  }
  // Validate colorPaletteDistribution sums to 100 if present
  if (this.colorPaletteDistribution) {
    const { primaryPercentage, secondaryPercentage } = this.colorPaletteDistribution;
    if (primaryPercentage != null && secondaryPercentage != null && (primaryPercentage + secondaryPercentage !== 100)) {
      next(new Error('Color palette distribution percentages must sum to 100.'));
      return;
    }
  }
  // Validate token distribution sums to 10 if present
  if (this.detailElementTokenDistribution) {
    const totalTokens = Array.from(this.detailElementTokenDistribution.values()).reduce((sum, count) => sum + count, 0);
    if (totalTokens !== 10) {
        next(new Error('Detail element token distribution must sum to 10.'));
        return;
    }
  }
  next();
});

export default mongoose.model<IAssessmentProfile>('AssessmentProfile', AssessmentProfileSchema);
