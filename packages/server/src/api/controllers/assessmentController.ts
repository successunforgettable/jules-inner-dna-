import { Request, Response, NextFunction } from 'express';
import AssessmentProfile, { IAssessmentProfile } from '../../models/AssessmentProfile';
import User from '../../models/User'; // Assuming User model is in User.ts
import EnneagramType from '../../models/EnneagramType'; // For resolving ObjectId
import Wing from '../../models/Wing'; // For resolving ObjectId
import InstinctualStacking from '../../models/InstinctualStacking'; // For resolving ObjectId
import mongoose from 'mongoose';

// Extend Express Request type to include 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // Assuming id is string representation of ObjectId
    // other user properties if available from auth middleware
  };
}

export const getAssessmentProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authenticated or user ID missing.' });
    }
    const userId = req.user.id;

    const profile = await AssessmentProfile.findOne({ user: userId })
      .populate('user', 'email firstName lastName') // Populate user details
      .populate('determinedCoreType') // Populates IEnneagramType
      .populate({ // Populate Wing and its nested EnneagramTypes
        path: 'determinedWing',
        populate: [
          { path: 'primaryType', select: 'number name nickname' },
          { path: 'wingType', select: 'number name nickname' }
        ]
      })
      .populate('determinedInstinctualStacking');

    if (!profile) {
      // Return a default empty profile structure or 404
      // For now, let's return 404 if no profile exists, client can handle creating one on first save.
      // Or, we can return an empty structure linked to the user:
      // return res.status(200).json({ user: userId, isComplete: false, foundationStoneSelections: [] /* ...other empty fields */ });
      return res.status(404).json({ message: 'Assessment profile not found for this user.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const saveAssessmentProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authenticated or user ID missing.' });
    }
    const userId = req.user.id;
    const profileData = req.body as Partial<IAssessmentProfile>;

    // Ensure the user field is set correctly from the authenticated user
    profileData.user = new mongoose.Types.ObjectId(userId);

    // If determinedCoreType is sent as a number, try to convert to ObjectId
    if (profileData.determinedCoreType && typeof profileData.determinedCoreType === 'number') {
        const coreTypeDoc = await EnneagramType.findOne({ number: profileData.determinedCoreType });
        if (coreTypeDoc) {
            profileData.determinedCoreType = coreTypeDoc._id;
        } else {
            // Handle case where type number is invalid - perhaps remove or log error
            console.warn(`Invalid Enneagram Type number ${profileData.determinedCoreType} provided during save.`);
            delete profileData.determinedCoreType;
        }
    }
    // Similar logic might be needed for determinedWing if it's sent as a name/number combination
    // For now, assuming client sends ObjectId or the seed script handles Wing ObjectIds correctly.

    // If profile is marked complete, set the completedDate
    if (profileData.isComplete && !profileData.completedDate) {
        profileData.completedDate = new Date();
    }

    const updatedProfile = await AssessmentProfile.findOneAndUpdate(
      { user: userId },
      { $set: profileData }, // Use $set to update only provided fields
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    )
    .populate('user', 'email firstName lastName')
    .populate('determinedCoreType')
    .populate({
        path: 'determinedWing',
        populate: [
          { path: 'primaryType', select: 'number name nickname' },
          { path: 'wingType', select: 'number name nickname' }
        ]
      })
    .populate('determinedInstinctualStacking');

    // Link this profile to the User document if it's newly created (upserted)
    // and not already linked. This ensures the User.assessmentProfile field is populated.
    if (updatedProfile) {
        const userDoc = await User.findById(userId);
        if (userDoc && (!userDoc.assessmentProfile || userDoc.assessmentProfile.toString() !== updatedProfile._id.toString())) {
            userDoc.assessmentProfile = updatedProfile._id;
            await userDoc.save();
        }
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};
