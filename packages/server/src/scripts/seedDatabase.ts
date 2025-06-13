import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './packages/server/.env' }); // Adjust path if run from root, or ensure .env is in the right place for ts-node

// Import Models
import EnneagramTypeModel from '../models/EnneagramType';
import WingModel from '../models/Wing';
import ArrowModel from '../models/Arrow';
import OperatingStateModel from '../models/OperatingState';
import InstinctualStackingModel from '../models/InstinctualStacking';
// User and AssessmentProfile models are not typically seeded this way unless for test users.

// Import Seed Data
import { enneagramTypesSeed } from '../seed-data/enneagramTypes';
import { wingsSeed } from '../seed-data/wings';
import { arrowsSeed } from '../seed-data/arrows';
import { operatingStatesSeed } from '../seed-data/operatingStates';
import { instinctualStackingsSeed } from '../seed-data/instinctualStackings';

const MONGODB_URI = process.env.MONGODB_URI_DEV || process.env.MONGODB_URI || 'mongodb://localhost:27017/inner_dna_dev';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB for seeding.');

    // Clear existing collections
    console.log('Clearing existing data...');
    await EnneagramTypeModel.deleteMany({});
    await WingModel.deleteMany({});
    await ArrowModel.deleteMany({});
    await OperatingStateModel.deleteMany({});
    await InstinctualStackingModel.deleteMany({});
    console.log('Existing data cleared.');

    // Seed EnneagramTypes
    console.log('Seeding EnneagramTypes...');
    const createdEnneagramTypes = await EnneagramTypeModel.insertMany(enneagramTypesSeed);
    console.log(`${createdEnneagramTypes.length} EnneagramTypes seeded.`);

    // Create a map for quick lookup of EnneagramType ObjectIds by their number
    const typeNumberToIdMap = new Map<number, mongoose.Types.ObjectId>();
    createdEnneagramTypes.forEach(typeDoc => {
      if (typeDoc && typeDoc.number != null && typeDoc._id) { // Added null checks
        typeNumberToIdMap.set(typeDoc.number, typeDoc._id);
      }
    });

    // Seed Wings
    console.log('Seeding Wings...');
    const wingsToSeed = wingsSeed.map(wing => {
      const primaryTypeId = typeNumberToIdMap.get(wing.primaryTypeNumber);
      const wingTypeId = typeNumberToIdMap.get(wing.wingTypeNumber);

      if (!primaryTypeId || !wingTypeId) {
        console.error(`Could not find ObjectId for primaryTypeNumber ${wing.primaryTypeNumber} or wingTypeNumber ${wing.wingTypeNumber} for wing "${wing.name}". Skipping this wing.`);
        return null;
      }
      return {
        ...wing,
        primaryType: primaryTypeId,
        wingType: wingTypeId,
      };
    }).filter(w => w !== null) as any[]; // Filter out nulls and assert type if confident

    if (wingsToSeed.length > 0) {
      const createdWings = await WingModel.insertMany(wingsToSeed);
      console.log(`${createdWings.length} Wings seeded.`);
    } else {
      console.log('No Wings to seed after filtering (possibly due to missing type references).');
    }

    // Seed Arrows
    console.log('Seeding Arrows...');
    const createdArrows = await ArrowModel.insertMany(arrowsSeed);
    console.log(`${createdArrows.length} Arrows seeded.`);

    // Seed OperatingStates
    console.log('Seeding OperatingStates...');
    const createdOperatingStates = await OperatingStateModel.insertMany(operatingStatesSeed);
    console.log(`${createdOperatingStates.length} OperatingStates seeded.`);

    // Seed InstinctualStackings
    console.log('Seeding InstinctualStackings...');
    const createdInstinctualStackings = await InstinctualStackingModel.insertMany(instinctualStackingsSeed);
    console.log(`${createdInstinctualStackings.length} InstinctualStackings seeded.`);

    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

seedDatabase();
