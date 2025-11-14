# Exercise Data Guide

This guide covers the exercise database structure, data import process, and management of exercise data for the Workout Backend Service.

---

## Overview

The exercise database contains comprehensive information about various exercises including:

- **Exercise Details** - Name, instructions, difficulty level
- **Muscle Groups** - Primary and secondary muscles targeted
- **Equipment** - Required equipment for the exercise
- **Categories** - Exercise types (strength, cardio, mobility)
- **Mechanics** - Movement patterns (compound, isolation)
- **Images** - Visual demonstrations of exercises

**Total Exercises:** 1,300+ exercises from various categories
**Data Source:** Curated exercise database with standardized format
**File Location:** `server/data/exercises.json`

---

## Data Structure

### Exercise Object Schema

```typescript
interface ExerciseData {
  name: string; // Exercise name (e.g., "Bench Press")
  force: string; // Movement type: "push", "pull", "static"
  level: string; // Difficulty: "beginner", "intermediate", "advanced"
  mechanic: string; // Movement pattern: "compound", "isolation"
  equipment: string; // Required equipment
  primaryMuscles: string[]; // Main muscles targeted
  secondaryMuscles: string[]; // Supporting muscles
  instructions: string[]; // Step-by-step instructions
  category: string; // Exercise type: "strength", "cardio", "stretching"
  images: string[]; // Array of image filenames
  id: string; // Unique identifier
}
```

### Sample Exercise Entry

```json
{
  "name": "Bench Press",
  "force": "push",
  "level": "beginner",
  "mechanic": "compound",
  "equipment": "barbell",
  "primaryMuscles": ["chest"],
  "secondaryMuscles": ["triceps", "shoulders"],
  "instructions": [
    "Lie back on a flat bench with feet firmly planted on the ground.",
    "Grab the barbell with an overhand grip, hands slightly wider than shoulder-width.",
    "Lower the bar to your chest in a controlled manner.",
    "Press the bar back up to the starting position.",
    "Repeat for desired repetitions."
  ],
  "category": "strength",
  "images": ["Bench_Press/0.jpg", "Bench_Press/1.jpg"],
  "id": "Bench_Press"
}
```

---

## Database Schema

### Exercise Table

```sql
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL,
  force "Force",                    -- PUSH, PULL, STATIC
  level "Difficulty",               -- BEGINNER, INTERMEDIATE, ADVANCED
  mechanic "Mechanic",              -- COMPOUND, ISOLATION
  equipment VARCHAR(80),
  primary_muscles TEXT[],           -- Array of muscle groups
  secondary_muscles TEXT[],         -- Array of muscle groups
  instructions TEXT,                -- Combined instructions
  category "ExerciseType",          -- STRENGTH, CARDIO, MOBILITY
  images TEXT[],                    -- Array of image paths
  exercise_id VARCHAR(100) UNIQUE   -- Original ID from source
);
```

### Enums

```sql
-- Exercise categories
CREATE TYPE "ExerciseType" AS ENUM ('STRENGTH', 'CARDIO', 'MOBILITY');

-- Difficulty levels
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- Force types
CREATE TYPE "Force" AS ENUM ('PUSH', 'PULL', 'STATIC');

-- Movement mechanics
CREATE TYPE "Mechanic" AS ENUM ('COMPOUND', 'ISOLATION');
```

---

## Data Import Process

### Import Script

The application includes an import script to populate the exercise database:

```bash
# Import exercises from JSON file
pnpm run import:exercises

# Clear existing exercises and import fresh data
pnpm run import:exercises:clear
```

### Import Script Features

```typescript
// server/src/scripts/importExercises.ts
async function importExercises() {
  // 1. Read JSON file from /data directory
  const exercisesData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // 2. Optional: Clear existing exercises
  if (process.argv.includes("--clear")) {
    await prisma.exercise.deleteMany({});
  }

  // 3. Transform and validate data
  const processedExercises = exercisesData.map(transformExercise);

  // 4. Batch insert with error handling
  for (const exercise of processedExercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: exercise,
      create: exercise,
    });
  }

  // 5. Report results
  logger.info(`✅ Import completed: ${successCount}/${totalCount} exercises`);
}
```

### Data Transformation

The import process normalizes data to match the database schema:

```typescript
function transformExercise(rawExercise: ExerciseData) {
  return {
    name: rawExercise.name,
    force: mapForce(rawExercise.force), // "push" → "PUSH"
    level: mapDifficulty(rawExercise.level), // "beginner" → "BEGINNER"
    mechanic: mapMechanic(rawExercise.mechanic), // "compound" → "COMPOUND"
    equipment: rawExercise.equipment || null,
    primaryMuscles: rawExercise.primaryMuscles,
    secondaryMuscles: rawExercise.secondaryMuscles,
    instructions: rawExercise.instructions.join("\n"),
    category: mapCategory(rawExercise.category), // "strength" → "STRENGTH"
    images: rawExercise.images,
    exerciseId: rawExercise.id,
  };
}
```

---

## Muscle Groups

### Primary Muscle Groups

```javascript
const MUSCLE_GROUPS = [
  "abdominals",
  "biceps",
  "calves",
  "chest",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "lower back",
  "middle back",
  "neck",
  "quadriceps",
  "shoulders",
  "traps",
  "triceps",
];
```

### Muscle Group Mapping

```typescript
// Common muscle group aliases
const MUSCLE_ALIASES = {
  abs: "abdominals",
  pecs: "chest",
  quads: "quadriceps",
  lats: "lats",
  delts: "shoulders",
  hams: "hamstrings",
};
```

---

## Equipment Types

### Supported Equipment

```javascript
const EQUIPMENT_TYPES = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "body only",
  "kettlebell",
  "resistance bands",
  "medicine ball",
  "foam roll",
  "exercise ball",
  "e-z curl bar",
  "other",
];
```

### Equipment Normalization

```typescript
function normalizeEquipment(equipment: string): string {
  const normalized = equipment.toLowerCase().trim();

  // Handle common variations
  const equipmentMap: Record<string, string> = {
    bodyweight: "body only",
    dumbbells: "dumbbell",
    barbells: "barbell",
    cables: "cable",
    machines: "machine",
  };

  return equipmentMap[normalized] || normalized;
}
```

---

## Exercise Categories

### Category Distribution

- **Strength (80%)** - Weight lifting, resistance exercises
- **Cardio (15%)** - Cardiovascular exercises
- **Mobility (5%)** - Stretching, flexibility exercises

### Category Mapping

```typescript
function mapCategory(category: string): ExerciseType {
  const categoryMap: Record<string, ExerciseType> = {
    strength: "STRENGTH",
    cardio: "CARDIO",
    stretching: "MOBILITY",
    plyometrics: "CARDIO",
    powerlifting: "STRENGTH",
    "olympic weightlifting": "STRENGTH",
  };

  return categoryMap[category.toLowerCase()] || "STRENGTH";
}
```

---

## Image Management

### Image Structure

```
public/exercises/
├── Exercise_Name/
│   ├── 0.jpg          # Starting position
│   ├── 1.jpg          # End position
│   └── thumbnail.jpg  # Optional thumbnail
└── ...
```

### Image Serving

```typescript
// Static file serving for exercise images
app.use("/exercises", express.static(path.join(__dirname, "../public/exercises")));

// Example URLs:
// GET /exercises/Bench_Press/0.jpg
// GET /exercises/Push_Up/1.jpg
```

### Image Processing

```typescript
// Optional: Generate thumbnails during import
import sharp from "sharp";

async function generateThumbnail(imagePath: string) {
  const thumbnailPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, "_thumb.$1");

  await sharp(imagePath)
    .resize(200, 200, { fit: "inside" })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);
}
```

---

## Search and Filtering

### Search Implementation

```typescript
// Multi-field search
async function searchExercises(query: string) {
  return await prisma.exercise.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { primaryMuscles: { has: query.toLowerCase() } },
        { equipment: { contains: query, mode: "insensitive" } },
        { instructions: { contains: query, mode: "insensitive" } },
      ],
    },
  });
}
```

### Filter Options

```typescript
interface ExerciseFilters {
  category?: ExerciseType;
  level?: Difficulty;
  equipment?: string;
  primaryMuscles?: string;
  force?: Force;
  mechanic?: Mechanic;
  search?: string;
}
```

---

## Data Quality

### Validation Rules

```typescript
// Exercise validation schema
const exerciseSchema = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 120,
    unique: true,
  },
  primaryMuscles: {
    required: true,
    minItems: 1,
    validMuscles: MUSCLE_GROUPS,
  },
  instructions: {
    required: true,
    minLength: 50,
  },
  category: {
    required: true,
    enum: ["STRENGTH", "CARDIO", "MOBILITY"],
  },
};
```

### Data Cleaning

```typescript
function cleanExerciseData(exercise: ExerciseData) {
  return {
    ...exercise,
    name: exercise.name.trim(),
    equipment: exercise.equipment?.toLowerCase(),
    primaryMuscles: exercise.primaryMuscles.map((m) => m.toLowerCase()),
    secondaryMuscles: exercise.secondaryMuscles.map((m) => m.toLowerCase()),
    instructions: exercise.instructions.filter((inst) => inst.trim().length > 0),
  };
}
```

---

## Custom Exercises

### User Custom Exercises

Users can create their own exercises through the API:

```typescript
// Create custom exercise
POST /api/users/custom-exercises
{
  "name": "My Custom Exercise",
  "description": "Custom exercise description",
  "category": "STRENGTH",
  "primaryMuscles": ["chest", "triceps"],
  "equipment": "dumbbell",
  "instructions": "Detailed instructions..."
}
```

### Custom Exercise Storage

```sql
CREATE TABLE user_custom_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  category "ExerciseType" DEFAULT 'STRENGTH',
  primary_muscles TEXT[] NOT NULL,
  secondary_muscles TEXT[],
  equipment VARCHAR(80),
  instructions TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);
```

---

## Performance Optimization

### Database Indexes

```sql
-- Search performance indexes
CREATE INDEX idx_exercises_name ON exercises USING gin(to_tsvector('english', name));
CREATE INDEX idx_exercises_muscles ON exercises USING gin(primary_muscles);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_level ON exercises(level);
CREATE INDEX idx_exercises_equipment ON exercises(equipment);
```

### Caching Strategy

```typescript
// Cache popular exercise queries
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function getCachedExercises(key: string) {
  const cached = await redis.get(`exercises:${key}`);
  if (cached) {
    return JSON.parse(cached);
  }

  const exercises = await prisma.exercise.findMany({...});
  await redis.setex(`exercises:${key}`, 3600, JSON.stringify(exercises)); // 1 hour cache

  return exercises;
}
```

---

## API Endpoints

### Exercise Endpoints

```typescript
// Search exercises
GET /api/exercises?search=bench&category=STRENGTH&level=BEGINNER

// Get exercise by ID
GET /api/exercises/123

// Get random exercises
GET /api/exercises/random?limit=10

// Get muscle groups
GET /api/exercises/muscle-groups

// Get equipment types
GET /api/exercises/equipment-types

// Get filter options
GET /api/exercises/filter-options
```

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bench Press",
      "category": "STRENGTH",
      "level": "BEGINNER",
      "force": "PUSH",
      "mechanic": "COMPOUND",
      "equipment": "barbell",
      "primaryMuscles": ["chest"],
      "secondaryMuscles": ["triceps", "shoulders"],
      "instructions": "Step by step instructions...",
      "images": ["Bench_Press/0.jpg", "Bench_Press/1.jpg"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 18,
    "total": 1300,
    "pages": 73
  }
}
```

---

## Maintenance

### Regular Updates

```bash
# Update exercise database quarterly
# 1. Download new exercise data
# 2. Backup current database
# 3. Run import script with --clear flag
# 4. Verify data integrity
# 5. Update image assets

# Example maintenance script
#!/bin/bash
echo "Starting exercise database update..."
pg_dump workout_db > backup_$(date +%Y%m%d).sql
pnpm run import:exercises:clear
echo "Exercise database updated successfully!"
```

### Data Integrity Checks

```sql
-- Check for exercises without muscle groups
SELECT id, name FROM exercises
WHERE array_length(primary_muscles, 1) IS NULL;

-- Check for missing images
SELECT id, name FROM exercises
WHERE array_length(images, 1) IS NULL;

-- Check for duplicate names
SELECT name, COUNT(*) FROM exercises
GROUP BY name HAVING COUNT(*) > 1;
```

---

## Migration Guide

### Database Migration

```sql
-- Add new columns (example)
ALTER TABLE exercises ADD COLUMN difficulty_score INTEGER;
ALTER TABLE exercises ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing data
UPDATE exercises SET difficulty_score =
  CASE level
    WHEN 'BEGINNER' THEN 1
    WHEN 'INTERMEDIATE' THEN 2
    WHEN 'ADVANCED' THEN 3
  END;
```

### Version Compatibility

```typescript
// Handle different data format versions
function migrateExerciseData(data: any, version: string) {
  switch (version) {
    case "v1":
      return migrateFromV1(data);
    case "v2":
      return migrateFromV2(data);
    default:
      return data;
  }
}
```

---

## Best Practices

### Data Management

1. **Regular Backups** - Daily automated backups
2. **Version Control** - Track changes to exercise data
3. **Quality Assurance** - Validate data before import
4. **User Feedback** - Monitor reports of incorrect data
5. **Performance Monitoring** - Track query performance

### Content Guidelines

1. **Clear Instructions** - Step-by-step, easy to follow
2. **Accurate Muscle Mapping** - Anatomically correct
3. **Consistent Naming** - Standardized exercise names
4. **Quality Images** - Clear demonstration photos
5. **Safety Notes** - Include safety considerations

This guide ensures proper management and utilization of the exercise database for optimal user experience.
