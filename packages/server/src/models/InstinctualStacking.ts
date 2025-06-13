import mongoose, { Schema, Document } from 'mongoose';

interface ITypeSpecificInstinctualStackingDescription {
  typeNumber: number; // Enneagram type number (1-9)
  subtypeName: string; // e.g., "The Worrier" (for Type 1 SP), "The Competitor" (for Type 3 SO)
  description: string; // How this stacking manifests for this specific Enneagram type
}

export interface IInstinctualStacking extends Document {
  stack: string; // e.g., "sp/so", "so/sx", "sx/sp" (Primary/Secondary)
  primaryInstinct: 'Self-Preservation' | 'Social' | 'Sexual/One-to-One';
  secondaryInstinct: 'Self-Preservation' | 'Social' | 'Sexual/One-to-One';
  blindInstinct: 'Self-Preservation' | 'Social' | 'Sexual/One-to-One';
  generalDescription: string; // General description of this stacking pattern
  typeSpecificDescriptions: ITypeSpecificInstinctualStackingDescription[];
  createdAt: Date;
  updatedAt: Date;
}

const TypeSpecificStackingDescriptionSchema: Schema = new Schema(
  {
    typeNumber: { type: Number, required: true, min: 1, max: 9 },
    subtypeName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const InstinctualStackingSchema: Schema = new Schema(
  {
    stack: {
      type: String,
      required: true,
      unique: true, // e.g., "sp/so" should be unique
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^(sp|so|sx)\/(sp|so|sx)$/.test(v) && v.split('/')[0] !== v.split('/')[1];
        },
        message: (props: { value: string }) => `${props.value} is not a valid stack format (e.g., "sp/so", "so/sx"). Primary and secondary instincts must be different.`,
      },
    },
    primaryInstinct: {
      type: String,
      required: true,
      enum: ['Self-Preservation', 'Social', 'Sexual/One-to-One'],
    },
    secondaryInstinct: {
      type: String,
      required: true,
      enum: ['Self-Preservation', 'Social', 'Sexual/One-to-One'],
    },
    blindInstinct: {
      type: String,
      required: true,
      enum: ['Self-Preservation', 'Social', 'Sexual/One-to-One'],
    },
    generalDescription: {
      type: String,
      required: true,
    },
    typeSpecificDescriptions: [TypeSpecificStackingDescriptionSchema],
  },
  {
    timestamps: true,
  }
);

InstinctualStackingSchema.pre('save', function (next) {
  const instincts = ['Self-Preservation', 'Social', 'Sexual/One-to-One'];
  if (this.primaryInstinct === this.secondaryInstinct ||
      this.primaryInstinct === this.blindInstinct ||
      this.secondaryInstinct === this.blindInstinct) {
    next(new Error('Primary, secondary, and blind instincts must be unique.'));
    return;
  }
  const providedInstincts = [this.primaryInstinct, this.secondaryInstinct, this.blindInstinct].sort().join(',');
  if (providedInstincts !== instincts.sort().join(',')) {
    next(new Error('All three instinct types must be present and correctly assigned as primary, secondary, or blind.'));
    return;
  }
  next();
});


export default mongoose.model<IInstinctualStacking>('InstinctualStacking', InstinctualStackingSchema);
