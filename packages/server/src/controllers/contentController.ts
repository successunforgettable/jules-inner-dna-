import { Request, Response } from 'express';
import FoundationStoneSet from '../models/FoundationStoneSet.model';
import BuildingBlockPair from '../models/BuildingBlockPair.model';
import ColorPaletteInfo from '../models/ColorPaletteInfo.model';
import TypeSpecificText from '../models/TypeSpecificText.model';
import { z } from 'zod';

// Zod schema for query parameters
const PrimaryTypeQuerySchema = z.object({
  type: z.string().regex(/^[1-9]$/, "Primary type must be a digit from 1 to 9"),
});

const TypeSpecificTextQuerySchema = z.object({
  type: z.string().min(1, "Primary type is required (can be 'all')"), // Allow "all" for generic texts
  category: z.string().min(1, "Category is required"),
  itemKey: z.string().optional(),
});


export const getFoundationStoneSets = async (req: Request, res: Response): Promise<Response> => {
  try {
    const stoneSets = await FoundationStoneSet.find().sort({ setId: 1 }); // Sort by setId (e.g., "set1", "set2")
    if (!stoneSets || stoneSets.length === 0) {
      return res.status(404).json({ message: 'No foundation stone sets found.' });
    }
    return res.status(200).json(stoneSets);
  } catch (error) {
    console.error('Error fetching foundation stone sets:', error);
    return res.status(500).json({ message: 'Server error while fetching foundation stone sets.' });
  }
};

export const getBuildingBlockPairs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queryValidation = PrimaryTypeQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({ message: 'Invalid primary type query parameter.', errors: queryValidation.error.flatten().fieldErrors });
    }
    const primaryType = queryValidation.data.type;

    // Fetch generic pairs (enneagramType is null or not set)
    const genericPairs = await BuildingBlockPair.find({ enneagramType: null })
      .sort({ pairId: 1 }); // Ensure consistent order, e.g., growth_focus then response_pattern

    // Fetch type-specific pairs
    const typeSpecificPairs = await BuildingBlockPair.find({ enneagramType: primaryType })
      .sort({ pairType: 1 }); // Ensure consistent order, e.g., wing then arrow

    if (typeSpecificPairs.length < 2) { // Should have wing and arrow
        console.warn(`Expected 2 type-specific pairs for type ${primaryType}, found ${typeSpecificPairs.length}`);
    }
    if (genericPairs.length < 2) { // Should have growth and response
        console.warn(`Expected 2 generic pairs, found ${genericPairs.length}`);
    }

    // Combine and order: Wing, Arrow, Growth Focus, Response Pattern (as per client-side data structure)
    const wingPair = typeSpecificPairs.find(p => p.pairType === 'wing');
    const arrowPair = typeSpecificPairs.find(p => p.pairType === 'arrow');
    const growthFocusPair = genericPairs.find(p => p.pairType === 'growth_focus');
    const responsePatternPair = genericPairs.find(p => p.pairType === 'response_pattern');

    const orderedPairs = [];
    if (wingPair) orderedPairs.push(wingPair); else console.warn(`Wing pair not found for type ${primaryType}`);
    if (arrowPair) orderedPairs.push(arrowPair); else console.warn(`Arrow pair not found for type ${primaryType}`);
    if (growthFocusPair) orderedPairs.push(growthFocusPair); else console.warn(`Generic growth focus pair not found`);
    if (responsePatternPair) orderedPairs.push(responsePatternPair); else console.warn(`Generic response pattern pair not found`);

    if (orderedPairs.length !== 4 && orderedPairs.length > 0) { // Be flexible if some are missing but not all
      console.warn(`Returning ${orderedPairs.length} block pairs instead of 4 for type ${primaryType}.`);
    }
    if (orderedPairs.length === 0 && (typeSpecificPairs.length > 0 || genericPairs.length > 0)){
        // If specific pairs were found but not in the expected structure, return them anyway
        return res.status(200).json([...typeSpecificPairs, ...genericPairs]);
    }
    if (orderedPairs.length === 0){
         return res.status(404).json({ message: `No building block pairs found for type ${primaryType} or generic pairs.` });
    }


    return res.status(200).json(orderedPairs);
  } catch (error) {
    console.error('Error fetching building block pairs:', error);
    return res.status(500).json({ message: 'Server error while fetching building block pairs.' });
  }
};

export const getColorPalettes = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Sort by a logical order if 'paletteId' isn't inherently sortable for desired display
    // e.g., state_very_good, state_good, etc. This might require an 'order' field in the schema.
    // For now, assuming paletteId can be sorted or client handles ordering of 5 known palettes.
    const palettes = await ColorPaletteInfo.find().sort({ paletteId: 1 });
    if (!palettes || palettes.length === 0) {
      return res.status(404).json({ message: 'No color palettes found.' });
    }
    return res.status(200).json(palettes);
  } catch (error) {
    console.error('Error fetching color palettes:', error);
    return res.status(500).json({ message: 'Server error while fetching color palettes.' });
  }
};

export const getTypeSpecificTexts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const queryValidation = TypeSpecificTextQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({ message: 'Invalid query parameters for type-specific texts.', errors: queryValidation.error.flatten().fieldErrors });
    }
    const { type, category, itemKey } = queryValidation.data;

    const query: any = { enneagramType: type, category: category };
    if (itemKey) {
      query.itemKey = itemKey;
    }

    const texts = await TypeSpecificText.find(query);
    // Consider returning a map if multiple itemKeys are expected for a category, e.g.:
    // if (category === 'reportSectionNarrative' && !itemKey) {
    //   const mappedTexts = texts.reduce((acc, text) => {
    //     if(text.itemKey) acc[text.itemKey] = text.content;
    //     return acc;
    //   }, {});
    //   return res.status(200).json(mappedTexts);
    // }

    if (!texts || texts.length === 0) {
      return res.status(404).json({ message: 'No type-specific texts found for the given criteria.' });
    }
    return res.status(200).json(texts); // Returns an array of text objects
  } catch (error) {
    console.error('Error fetching type-specific texts:', error);
    return res.status(500).json({ message: 'Server error while fetching type-specific texts.' });
  }
};
```
