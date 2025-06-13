import express from 'express';
// Ensure this path correctly points to the (now in-memory) authController
import { registerUser, loginUser, getAllUsers_InMemory_Debug } from '../../controllers/authController';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/users_debug
 * @desc    (DEBUG ONLY) Get all in-memory users
 * @access  Public (should be removed or protected in real scenarios)
 */
if (process.env.NODE_ENV !== 'production') { // Only include in non-production environments
    router.get('/users_debug', getAllUsers_InMemory_Debug);
}


// Optional: Refresh token route would be here
// router.post('/refresh-token', refreshTokenController);

export default router;
```
