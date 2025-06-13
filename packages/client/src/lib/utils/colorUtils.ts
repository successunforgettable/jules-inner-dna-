// Color Utilities

/**
 * Placeholder function to generate a type-specific gradient.
 * In a real implementation, this would involve parsing the baseGradient,
 * converting colors to a model like HSL, applying hue/saturation shifts
 * based on personalityType, and then reconstructing the gradient string.
 *
 * This is a complex task involving color theory and manipulation.
 * For now, this function serves as a placeholder to demonstrate the concept.
 *
 * Ref Sec 4.3.2 of corrected_personality_spec.md for per-type modifiers.
 * E.g., Type 1: Hue +5°, Saturation +5%
 *       Type 2: Hue +15°, Saturation +10%
 *       ...etc.
 *
 * @param baseGradient The base CSS gradient string for the state.
 * @param personalityType The user's primary Enneagram type (string "1"-"9").
 * @returns A new CSS gradient string modified for the personality type.
 */
export const generateModifiedGradient = (baseGradient: string, personalityType: string | null): string => {
  if (!personalityType) {
    return baseGradient; // Return base if no type to modify by
  }

  // Placeholder logic:
  // This just appends a comment to show it was called.
  // A real implementation would parse and modify colors in the gradient.
  // For example, if baseGradient = "linear-gradient(to right, #ff0000, #0000ff)"
  // A real function would:
  // 1. Parse out #ff0000 (red) and #0000ff (blue).
  // 2. Convert red and blue to HSL.
  // 3. Apply type-specific hue/saturation shifts to HSL values.
  // 4. Convert modified HSL values back to hex.
  // 5. Construct new gradient string: `linear-gradient(to right, newRedHex, newBlueHex)`

  let modificationComment = `/* Modified for Type ${personalityType}: `;
  switch (personalityType) {
    case "1": modificationComment += "Hue +5°, Sat +5%"; break;
    case "2": modificationComment += "Hue +15°, Sat +10%"; break;
    case "3": modificationComment += "Hue -5°, Sat +8%"; break; // Example modifiers
    case "4": modificationComment += "Hue +25°, Sat -5%"; break;
    case "5": modificationComment += "Hue -10°, Sat +5%"; break;
    case "6": modificationComment += "Hue +0°, Sat +10%"; break;
    case "7": modificationComment += "Hue +10°, Sat +12%"; break;
    case "8": modificationComment += "Hue -15°, Sat +10%"; break;
    case "9": modificationComment += "Hue -20°, Sat +5%"; break;
    default: modificationComment += "No specific modification defined"; break;
  }
  modificationComment += " */";

  // Simple modification for demonstration: slightly alter one known color if possible
  // This is very naive and depends on the gradient string format.
  if (baseGradient.includes('#22c55e')) { // "Good" state primary
    // return baseGradient.replace('#22c55e', '#20b050') + ` ${modificationComment}`;
  }
  // Just return the base gradient with a comment for now.
  return `${baseGradient} ${modificationComment}`;
};

// Example (more advanced, but still simplified) color modification function:
// This is NOT used by generateModifiedGradient above, just for illustration.
/*
const applyHueSaturationShift = (hexColor: string, hueShift: number, satShiftPercent: number): string => {
  // 1. Convert hex to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // 2. Convert RGB to HSL (simplified, not fully accurate)
  const r_ = r / 255, g_ = g / 255, b_ = b / 255;
  const max = Math.max(r_, g_, b_), min = Math.min(r_, g_, b_);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r_: h = (g_ - b_) / d + (g_ < b_ ? 6 : 0); break;
      case g_: h = (b_ - r_) / d + 2; break;
      case b_: h = (r_ - g_) / d + 4; break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  // 3. Apply shifts
  h = (h + hueShift) % 360;
  if (h < 0) h += 360;
  s = Math.max(0, Math.min(100, s + satShiftPercent));

  // 4. Convert HSL back to RGB (simplified)
  // ... this part is also non-trivial ...

  // 5. Convert RGB back to Hex
  // return `#${r.toString(16).padStart(2, '0')}...`;

  return hexColor; // Return original if conversion is too complex for placeholder
};
*/
```
