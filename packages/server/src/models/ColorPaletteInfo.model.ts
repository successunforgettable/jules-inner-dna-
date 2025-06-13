import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for the ColorPaletteInfo document
// This stores the base information for each of the 5 selectable color palettes.
// Type-specific descriptions for these palettes will be stored in TypeSpecificText.model.
export interface IColorPaletteInfo extends Document {
  paletteId: string; // e.g., "state_very_good", "state_good", unique identifier
  stateName: string; // User-facing name, e.g., "Very Good (Fully Activated)"
  genericDescription: string; // Default/generic description for this state palette
  baseGradientStyle: string; // CSS gradient string (can use CSS variables defined on client)
  primaryColor: string; // A dominant hex color from the base gradient, for simpler color manipulations
  // Optional: light/dark variants if the server needs to be aware of them for any reason
  // lightVariant?: string;
  // darkVariant?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ColorPaletteInfoSchema: Schema<IColorPaletteInfo> = new Schema<IColorPaletteInfo>({
  paletteId: {
    type: String,
    required: [true, 'Palette ID is required.'],
    unique: true,
    index: true,
  },
  stateName: {
    type: String,
    required: [true, 'State name is required.'],
  },
  genericDescription: {
    type: String,
    required: [true, 'Generic description is required.'],
  },
  baseGradientStyle: {
    type: String,
    required: [true, 'Base gradient style is required.'],
  },
  primaryColor: {
    type: String,
    required: [true, 'Primary color is required.'],
  },
  // lightVariant: { type: String },
  // darkVariant: { type: String },
}, { timestamps: true });

const ColorPaletteInfo: Model<IColorPaletteInfo> = mongoose.model<IColorPaletteInfo>('ColorPaletteInfo', ColorPaletteInfoSchema);

export default ColorPaletteInfo;
```
