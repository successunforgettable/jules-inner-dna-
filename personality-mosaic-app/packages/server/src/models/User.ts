import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface to define the structure of a User document
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  assessmentResults?: mongoose.Schema.Types.ObjectId[]; // Array of ObjectIds referencing 'Assessment' model
  // createdAt and updatedAt are automatically added by timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for User
const userSchemaOptions = {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
};

const UserSchema: Schema<IUser> = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email format validation
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  assessmentResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment', // Reference to another model (to be created later)
  }],
}, userSchemaOptions);

// Optional: Pre-save hook for updatedAt if not using timestamps:true
// UserSchema.pre<IUser>('save', function(next) {
//   if (this.isModified()) { // only update if it's a modification, not a new document
//     this.updatedAt = new Date();
//   }
//   next();
// });

// Optional: Index for faster email lookups
UserSchema.index({ email: 1 });

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
