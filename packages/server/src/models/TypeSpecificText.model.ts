import mongoose, { Schema, Document, Model } from 'mongoose';

export type TextCategory =
  | 'colorPaletteDescription'     // Type-specific descriptions for each of the 5 color palettes
  | 'subtypeContainerDescription' // Type-specific descriptions for each of the 3 subtype containers
  | 'reportSectionNarrative'      // Longer narrative texts for report sections (e.g., Core Type, Wing, Arrows intro/explanation)
  | 'growthPathTip'               // Specific growth tips for a type
  | 'relationshipDynamic'         // How a type behaves in relationships
  | string;                       // Allows for other categories

// Interface for the TypeSpecificText document
// This model will store various pieces of text content that are specific to an Enneagram type,
// and potentially to a specific item within a category (like a particular color palette or report section).
export interface ITypeSpecificText extends Document {
  textKey: string; // Globally unique key, e.g., "type1_state_very_good_desc", "type4_subtype_self_desc", "type7_report_core_narrative"
  enneagramType: string; // "1" through "9", or "all" for generic text not tied to a type but still categorized
  category: TextCategory;
  itemKey?: string; // Optional: e.g., "state_very_good", "self", "coreTypeIntro", "wing_1w9_detail"
                   // Helps further specify the text within a category for a type.
  content: string; // The actual text content. Could be plain text or Markdown.
  createdAt: Date;
  updatedAt: Date;
}

const TypeSpecificTextSchema: Schema<ITypeSpecificText> = new Schema<ITypeSpecificText>({
  textKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  enneagramType: {
    type: String,
    required: true,
    // enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "all"], // "all" for non-type-specific but categorized text
  },
  category: {
    type: String,
    required: true,
  },
  itemKey: { // e.g., specific palette ID, subtype ID, report section sub-key
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Compound index for efficient querying of texts for a specific type, category, and item
TypeSpecificTextSchema.index({ enneagramType: 1, category: 1, itemKey: 1 });

const TypeSpecificText: Model<ITypeSpecificText> = mongoose.model<ITypeSpecificText>('TypeSpecificText', TypeSpecificTextSchema);

export default TypeSpecificText;
```
