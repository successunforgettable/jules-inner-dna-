// packages/server/src/scripts/copySeedData.js
// This script copies the seed_data directory from the monorepo root
// to the dist/seed_data directory after TypeScript compilation.

const fs = require('fs-extra'); // Using fs-extra for convenient directory copying
const path = require('path');

const sourceDir = path.resolve(__dirname, '../../../../seed_data'); // Monorepo root/seed_data
const targetDir = path.resolve(__dirname, '../../dist/seed_data'); // server/dist/seed_data

async function copySeedData() {
  try {
    if (!fs.existsSync(sourceDir)) {
      console.warn(`Seed data source directory not found: ${sourceDir}. Skipping copy.`);
      // Create an empty target directory so the seed script doesn't fail on path resolution,
      // though it will fail if files are missing.
      await fs.ensureDir(targetDir);
      console.log(`Ensured target directory exists: ${targetDir}`);
      return;
    }
    await fs.ensureDir(targetDir); // Ensure target directory exists
    await fs.copy(sourceDir, targetDir);
    console.log(`Successfully copied seed_data from ${sourceDir} to ${targetDir}`);
  } catch (err) {
    console.error('Error copying seed_data:', err);
    process.exit(1); // Exit with error if copy fails
  }
}

copySeedData();
```
