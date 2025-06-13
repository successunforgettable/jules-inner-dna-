import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for the Stone sub-document
export interface IStone extends Document {
  stoneId: string; // e.g., "s1_1", unique within the set, but not necessarily globally
  contentLines: string[];
  typeAffinityKey: string; // e.g., "type1", "type5" - used by determinePersonalityType
  // gradientStyle from client-side personalityData.ts might be stored here if needed server-side
  // or if it's dynamically generated/fetched. For now, assuming client handles its display gradient.
}

const StoneSchema: Schema<IStone> = new Schema<IStone>({
  stoneId: { type: String, required: true },
  contentLines: { type: [String], required: true },
  typeAffinityKey: { type: String, required: true },
}, { _id: false }); // No separate _id for sub-documents unless necessary

// Interface for the FoundationStoneSet document
export interface IFoundationStoneSet extends Document {
  setId: string; // e.g., "set1" to "set9", globally unique
  instruction: string;
  stones: IStone[]; // Array of 3 stones
  // createdAt and updatedAt are automatically added by timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

const FoundationStoneSetSchema: Schema<IFoundationStoneSet> = new Schema<IFoundationStoneSet>({
  setId: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index for faster lookups by setId
  },
  instruction: {
    type: String,
    required: true,
  },
  stones: {
    type: [StoneSchema], // Array of IStone sub-documents
    required: true,
    validate: [ // Ensure there are exactly 3 stones
      (val: IStone[]) => val.length === 3,
      '{PATH} must contain exactly 3 stones.'
    ]
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const FoundationStoneSet: Model<IFoundationStoneSet> = mongoose.model<IFoundationStoneSet>('FoundationStoneSet', FoundationStoneSetSchema);

export default FoundationStoneSet;
```
