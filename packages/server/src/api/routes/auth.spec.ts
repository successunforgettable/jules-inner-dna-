import request from 'supertest';
import express from 'express'; // For app type, if not directly importing app
// Assuming your Express app instance is exported from your main server file or a dedicated app.ts
// For this example, let's assume 'app' can be imported or constructed for testing.
// If index.ts directly calls listen, you might need to refactor index.ts to export app
// or have an app.ts that exports the app without starting it.

// For now, we'll mock the app setup for demonstration if direct import is problematic
// In a real scenario, you'd import your configured Express app.
let app: express.Application;

// Mock the User model
const mockUserSave = jest.fn();
const mockUserFindOne = jest.fn();
jest.mock('../../models/User', () => ({
  __esModule: true, // This is important for ES6 modules
  default: jest.fn().mockImplementation(() => ({ // Mock the constructor
    save: mockUserSave,
  })),
  findOne: mockUserFindOne, // Static method if User.findOne is used
}));
// If User.findOne is a static method of the class (which it is for Mongoose)
(global as any).User = { findOne: mockUserFindOne };


// Mock bcrypt
const mockBcryptHash = jest.fn();
jest.mock('bcrypt', () => ({
  hash: mockBcryptHash,
  compare: jest.fn(), // Mock compare if testing login
}));

// Mock connectDB from db.ts to prevent actual DB connection
jest.mock('../../config/db', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined), // Mock successful connection
}));


// Dynamically import app after mocks are set up
// This is a common pattern to ensure mocks are applied before app instantiation
beforeAll(async () => {
  // Reset mocks before each test module run
  mockUserSave.mockReset();
  mockUserFindOne.mockReset();
  mockBcryptHash.mockReset();

  // Import your app instance here
  // This assumes your app setup doesn't immediately listen or can be conditionally prevented from listening
  // For example, index.ts might look like:
  // import app from './app'; const port = ...; if (process.env.NODE_ENV !== 'test') app.listen(port);
  // For now, let's simulate app loading from the current index.ts by re-requiring it (hacky for this env)
  // Ideally, app.ts exports app, index.ts imports and listens.
  const { default: expressApp } = await import('../../index'); // Assuming index.ts exports app
  app = expressApp;
});


describe('Auth API Routes - /api/auth', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockUserSave.mockClear();
    mockUserFindOne.mockClear();
    mockBcryptHash.mockClear();
  });

  describe('POST /register', () => {
    it('should register a new user successfully with valid data', async () => {
      mockUserFindOne.mockResolvedValue(null); // Simulate user not found
      mockBcryptHash.mockResolvedValue('hashedPassword123'); // Simulate password hashing
      mockUserSave.mockResolvedValue({ // Simulate successful save
        _id: 'mockUserId',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        createdAt: new Date().toISOString(),
      });

      // Re-initialize the model mock for User.findOne static method
      // This is tricky with current jest.mock, might need different mock setup for mongoose models
      // For Mongoose, User.findOne is a static method on the model class.
      // The default export is the model class.
      const UserMock = (await import('../../models/User')).default;
      (UserMock.findOne as jest.Mock).mockResolvedValue(null);


      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toHaveProperty('id', 'mockUserId');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(mockUserFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockBcryptHash).toHaveBeenCalledWith('password123', 10);
      // expect(mockUserSave).toHaveBeenCalledTimes(1); // This depends on how new User().save() is mocked
    });

    it('should return 409 if user already exists', async () => {
      mockUserFindOne.mockResolvedValue({ email: 'existing@example.com' });
      const UserMock = (await import('../../models/User')).default;
      (UserMock.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });


      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'existing@example.com', password: 'password123' });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('User already exists with this email');
    });

    it('should return 400 for invalid input data (e.g., missing password)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' }); // Missing password

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toHaveProperty('password');
    });
  });

  // Add similar tests for POST /api/auth/login
  // - Test successful login
  // - Test login with non-existent user
  // - Test login with incorrect password
  // - Test login with invalid input
});
