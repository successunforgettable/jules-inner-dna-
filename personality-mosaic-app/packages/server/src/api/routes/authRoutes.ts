import express from 'express';
import { registerUser, loginUser } from '../../controllers/authController';
// import { refreshToken } from '../../controllers/authController'; // If implementing refresh token route

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
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (requires valid refresh token)
 */
// router.post('/refresh-token', refreshToken); // Uncomment when refreshToken controller is implemented

export default router;
