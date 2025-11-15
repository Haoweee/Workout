import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local in development
// and .env.production in production, fallback to .env
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
config({ path: resolve(process.cwd(), envFile) });

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { ExerciseType, Difficulty, Force, Mechanic } from '@prisma/client';
import { logger } from '@utils/logger';

const prisma = new PrismaClient();

interface ExerciseData {
  name: string;
  force: string;
  level: string;
  mechanic: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  id: string;
}

/**
 * Import exercises from JSON file to database
 */
async function importExercises() {
  try {
    logger.info('🏋️ Starting exercise import...');

    // Read JSON file (adjust path to your JSON file)
    const jsonPath = path.join(__dirname, '../../data/exercises.json');

    if (!fs.existsSync(jsonPath)) {
      logger.error('❌ JSON file not found at:', jsonPath);
      logger.info('💡 Please place your exercises.json file in the /data directory');
      return;
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const exercisesData: ExerciseData[] = JSON.parse(rawData);

    logger.info(`📊 Found ${exercisesData.length} exercises to import`);

    // Clear existing exercises (optional - remove if you want to keep existing data)
    const shouldClearExisting = process.argv.includes('--clear');
    if (shouldClearExisting) {
      logger.info('🗑️ Clearing existing exercises...');
      await prisma.exercise.deleteMany({});
    }

    // Transform and validate data
    const transformedExercises = exercisesData
      .map((exercise, index) => {
        try {
          return {
            name: exercise.name?.trim(),
            force: mapForce(exercise.force),
            level: mapDifficulty(exercise.level),
            mechanic: mapMechanic(exercise.mechanic),
            equipment: exercise.equipment?.trim() || null,
            primaryMuscles: exercise.primaryMuscles || [],
            secondaryMuscles: exercise.secondaryMuscles || [],
            instructions: Array.isArray(exercise.instructions)
              ? exercise.instructions.map((inst) => inst.trim()).join('\n\n')
              : null,
            category: mapExerciseType(exercise.category),
            images: exercise.images || [],
            exerciseId: exercise.id?.trim() || exercise.name?.trim().replace(/\s+/g, '_'),
          };
        } catch (error) {
          logger.warn(`⚠️ Skipping exercise at index ${index}:`, error);
          return null;
        }
      })
      .filter(Boolean);

    logger.info(`✅ ${transformedExercises.length} exercises ready for import`);

    // Batch insert exercises
    const batchSize = 100;
    let importedCount = 0;

    for (let i = 0; i < transformedExercises.length; i += batchSize) {
      const batch = transformedExercises.slice(i, i + batchSize);

      try {
        await prisma.exercise.createMany({
          data: batch as any[],
          skipDuplicates: true, // Skip if exercise name already exists
        });

        importedCount += batch.length;
        logger.info(
          `📥 Imported batch ${Math.ceil((i + 1) / batchSize)} - Total: ${importedCount}`
        );
      } catch (error) {
        logger.error(`❌ Error importing batch starting at index ${i}:`, error);
      }
    }

    // Get final count
    const totalExercises = await prisma.exercise.count();
    logger.info(`🎉 Import complete! Total exercises in database: ${totalExercises}`);
  } catch (error) {
    logger.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Map string to ExerciseType enum
 */
function mapExerciseType(type?: string): ExerciseType | null {
  if (!type) return null;

  const typeMap: Record<string, ExerciseType> = {
    strength: ExerciseType.STRENGTH,
    cardio: ExerciseType.CARDIO,
    stretching: ExerciseType.MOBILITY,
    mobility: ExerciseType.MOBILITY,
    resistance: ExerciseType.STRENGTH,
    aerobic: ExerciseType.CARDIO,
    flexibility: ExerciseType.MOBILITY,
    powerlifting: ExerciseType.STRENGTH,
    olympic: ExerciseType.STRENGTH,
    strongman: ExerciseType.STRENGTH,
    plyometrics: ExerciseType.CARDIO,
  };

  return typeMap[type.toLowerCase()] || null;
}

/**
 * Map string to Difficulty enum
 */
function mapDifficulty(difficulty?: string): Difficulty | null {
  if (!difficulty) return null;

  const difficultyMap: Record<string, Difficulty> = {
    beginner: Difficulty.BEGINNER,
    intermediate: Difficulty.INTERMEDIATE,
    advanced: Difficulty.ADVANCED,
    easy: Difficulty.BEGINNER,
    medium: Difficulty.INTERMEDIATE,
    hard: Difficulty.ADVANCED,
  };

  return difficultyMap[difficulty.toLowerCase()] || null;
}

/**
 * Map string to Force enum
 */
function mapForce(force?: string): Force | null {
  if (!force) return null;

  const forceMap: Record<string, Force> = {
    push: Force.PUSH,
    pull: Force.PULL,
    static: Force.STATIC,
  };

  return forceMap[force.toLowerCase()] || null;
}

/**
 * Map string to Mechanic enum
 */
function mapMechanic(mechanic?: string): Mechanic | null {
  if (!mechanic) return null;

  const mechanicMap: Record<string, Mechanic> = {
    compound: Mechanic.COMPOUND,
    isolation: Mechanic.ISOLATION,
  };

  return mechanicMap[mechanic.toLowerCase()] || null;
}

// Run the import
if (require.main === module) {
  importExercises()
    .then(() => {
      logger.info('✨ Exercise import script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Exercise import script failed:', error);
      process.exit(1);
    });
}

export { importExercises };
