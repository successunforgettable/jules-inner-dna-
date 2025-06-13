import mongoose, { Schema, Document } from 'mongoose';

interface ITypeSpecificOperatingStateDescription {
  typeNumber: number; // Enneagram type number (1-9)
  description: string; // How this operating state manifests for this specific Enneagram type
}

export interface IOperatingState extends Document {
  name: string; // e.g., "Secure & Calm", "Socially Engaged", "Under Pressure"
  description: string; // General description of this state
  paletteName: string; // e.g., "Ocean Blues", "Forest Greens", "Volcanic Reds"
  colors: string[]; // Array of hex color codes for the palette
  typeSpecificDescriptions: ITypeSpecificOperatingStateDescription[];
  createdAt: Date;
  updatedAt: Date;
}

const TypeSpecificDescriptionSchema: Schema = new Schema(
  {
    typeNumber: { type: Number, required: true, min: 1, max: 9 },
    description: { type: String, required: true },
  },
  { _id: false }
);

const OperatingStateSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    paletteName: {
      type: String,
      required: true,
      trim: true,
    },
    colors: [
      {
        type: String,
        required: true,
        // Basic validation for hex color, can be more complex
        validate: {
          validator: function (v: string) {
            return /^#([0-9a-fA-F]{3}){1,2}$/.test(v);
          },
          message: (props: { value: string }) => `${props.value} is not a valid hex color!`,
        },
      },
    ],
    typeSpecificDescriptions: [TypeSpecificDescriptionSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOperatingState>('OperatingState', OperatingStateSchema);
