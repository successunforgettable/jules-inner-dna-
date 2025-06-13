import mongoose, { Schema, Document } from 'mongoose';

export interface IArrow extends Document {
  typeNumber: number; // e.g., 1 (for Type 1)
  stressTypeNumber: number; // e.g., 4 (Type 1 goes to 4 in stress)
  growthTypeNumber: number; // e.g., 7 (Type 1 goes to 7 in growth)
  stressDescription: string; // Description of behavior in stress
  growthDescription: string; // Description of behavior in growth
  createdAt: Date;
  updatedAt: Date;
}

const ArrowSchema: Schema = new Schema(
  {
    typeNumber: {
      type: Number,
      required: true,
      unique: true, // Each Enneagram type has only one set of arrows
      min: 1,
      max: 9,
    },
    stressTypeNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 9,
    },
    growthTypeNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 9,
    },
    stressDescription: {
      type: String,
      required: true,
    },
    growthDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that typeNumber, stressTypeNumber, and growthTypeNumber are not the same
ArrowSchema.pre('save', function (next) {
  if (
    this.typeNumber === this.stressTypeNumber ||
    this.typeNumber === this.growthTypeNumber ||
    this.stressTypeNumber === this.growthTypeNumber
  ) {
    next(new Error('Type number, stress type, and growth type must all be different.'));
  } else {
    next();
  }
});

export default mongoose.model<IArrow>('Arrow', ArrowSchema);
