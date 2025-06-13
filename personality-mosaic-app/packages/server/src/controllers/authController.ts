import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User, { IUser } from '../models/User'; // Import the User model

// --- Zod Schemas for Input Validation ---
const registerUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    // Add more password complexity rules if needed
});

const loginUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

// --- Controller Functions ---

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // 1. Validate input
    const validationResult = registerUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    const { email, password } = validationResult.data;

    // 2. Check if user already exists with Mongoose User model
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create new user with Mongoose User model
    const newUser = new User({
      email,
      passwordHash,
    });
    await newUser.save();

    // 5. Respond (excluding passwordHash)
    const userResponse = { id: newUser._id, email: newUser.email, createdAt: newUser.createdAt };
    return res.status(201).json({ message: 'User registered successfully', user: userResponse });

  } catch (error) {
    console.error('Registration error:', error);
    // Handle potential duplicate key error from MongoDB if unique constraint is violated concurrently
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
        return res.status(409).json({ message: 'User already exists with this email.' });
    }
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // 1. Validate input
    const validationResult = loginUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    const { email, password } = validationResult.data;

    // 2. Find user by email with Mongoose User model
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: Invalid email or password' });
    }

    // 3. Compare password with stored hash
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Authentication failed: Invalid email or password' });
    }

    // 4. Generate Tokens
    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error('JWT secrets are not defined in .env file');
      return res.status(500).json({ message: 'Internal server error: JWT configuration missing' });
    }

    const accessTokenPayload = { userId: user._id, email: user.email };
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    const refreshTokenPayload = { userId: user._id };
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    });

    // Note on Refresh Token Storage:
    // For production, HttpOnly cookies are recommended for refresh tokens.
    // If storing in DB:
    // user.refreshToken = refreshToken; // Assuming a field 'refreshToken' in IUser schema
    // await user.save();

    // 5. Respond with tokens and user details (excluding passwordHash)
    const userResponse = { id: user._id, email: user.email, createdAt: user.createdAt };
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: userResponse,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};
```
