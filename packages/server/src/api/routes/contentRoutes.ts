import express from 'express';
import * as contentController from '../controllers/contentController'; // Ensure this path is correct

const router = express.Router();

// Enneagram Types
router.get('/enneagram-types', contentController.getAllEnneagramTypes);
// It's common to use a plural form for consistency, but the model is EnneagramType.
// The path parameter :typeNumber will identify the specific type.
router.get('/enneagram-types/:typeNumber', contentController.getEnneagramTypeByNumber);

// Wings for a specific Enneagram Type number
// Using /type/:typeNumber to clearly indicate we're fetching wings related to a specific type.
router.get('/wings/type/:typeNumber', contentController.getWingsForType);

// Arrows for a specific Enneagram Type number
router.get('/arrows/type/:typeNumber', contentController.getArrowsForType);

// Operating States
router.get('/operating-states', contentController.getAllOperatingStates);

// Instinctual Stackings
router.get('/instinctual-stackings', contentController.getAllInstinctualStackings);

export default router;
