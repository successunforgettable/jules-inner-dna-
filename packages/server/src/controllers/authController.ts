import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// --- Zod Schemas for Input Validation ---
const registerUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

const loginUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

// --- In-memory store ---
interface User {
  id: string;
  email: string;
  passwordHash: string;
  // Note: In a real in-memory setup that needs to persist across restarts (for dev),
  // this might be written to a JSON file, but for this exercise, it's truly in-memory.
}
const users: User[] = [];

// --- Controller Functions ---

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validationResult = registerUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    const { email, password } = validationResult.data;

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser: User = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // More unique ID
      email,
      passwordHash,
    };
    users.push(newUser);

    const userResponse = { id: newUser.id, email: newUser.email };
    return res.status(201).json({ message: 'User registered successfully (in-memory)', user: userResponse });

  } catch (error) {
    console.error('In-memory registration error:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validationResult = loginUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    const { email, password } = validationResult.data;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Authentication failed: Invalid email or password' });
    }

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error('JWT secrets are not defined in .env file for in-memory auth');
      return res.status(500).json({ message: 'Internal server error: JWT configuration missing' });
    }

    const accessTokenPayload = { userId: user.id, email: user.email };
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    const refreshTokenPayload = { userId: user.id };
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    });

    const userResponse = { id: user.id, email: user.email };
    return res.status(200).json({
      message: 'Login successful (in-memory)',
      accessToken,
      refreshToken,
      user: userResponse,
    });

  } catch (error) {
    console.error('In-memory login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

// Optional: Function to get all users for debugging in-memory store
export const getAllUsers_InMemory_Debug = (req: Request, res: Response): Response => {
    return res.status(200).json(users.map(u => ({id: u.id, email: u.email})));
};
```
