# Database Schema Documentation

This document describes the PostgreSQL database schema for the Workout Backend Service using Prisma ORM.

---

## Overview

The database is designed to support a comprehensive workout and routine management system with the following core entities:

- **Users** - User accounts and profiles
- **Exercises** - Exercise database with muscle groups and equipment
- **Routines** - Custom workout routines with exercises
- **Workouts** - Individual workout sessions
- **Votes** - Community voting on routines
- **Custom Exercises** - User-created exercises

---

## Database Configuration

**Provider:** PostgreSQL
**ORM:** Prisma Client
**Connection:** Environment variable `DATABASE_URL`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Core Models

### User

User accounts and profile information.

```prisma
model User {
  id            String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  username      String          @unique
  fullName      String          @map("full_name")
  email         String          @unique @db.VarChar(320)
  passwordHash  String          @map("password_hash")
  avatarUrl     String?         @map("avatar_url")
  bio           String?         @db.Text
  isActive      Boolean         @default(true) @map("is_active")
  createdAt     DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt     DateTime        @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  routineVotes    RoutineVote[]
  routines        Routine[]
  workouts        Workout[]
  customExercises UserCustomExercise[]

  @@map("users")
}
```

**Key Features:**

- UUID primary key with PostgreSQL auto-generation
- Unique username and email constraints
- Optional avatar URL and bio
- Soft delete via `isActive` field
- Timezone-aware timestamps

### Exercise

Predefined exercise database with muscle groups and equipment.

```prisma
model Exercise {
  id               Int               @id @default(autoincrement())
  name             String            @unique @db.VarChar(120)
  force            Force?            // PUSH, PULL, STATIC
  level            Difficulty?       // BEGINNER, INTERMEDIATE, ADVANCED
  mechanic         Mechanic?         // COMPOUND, ISOLATION
  equipment        String?           @db.VarChar(80)
  primaryMuscles   String[]          @map("primary_muscles")
  secondaryMuscles String[]          @map("secondary_muscles")
  instructions     String?
  category         ExerciseType?     // STRENGTH, CARDIO, MOBILITY
  images           String[]          // Array of image URLs
  exerciseId       String            @unique @default("") @map("exercise_id") @db.VarChar(100)

  // Relations
  routineExercises RoutineExercise[]
  workoutSets      WorkoutSet[]

  @@map("exercises")
}
```

**Key Features:**

- Integer primary key for performance
- Searchable muscle group arrays
- Multiple image support
- Categorization by type, difficulty, and mechanics

### Routine

User-created workout routines with exercises.

```prisma
model Routine {
  id                String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  authorId          String            @map("author_id") @db.Uuid
  title             String            @db.VarChar(140)
  description       String?
  difficulty        Difficulty?
  visibility        Visibility        @default(PRIVATE) // PUBLIC, UNLISTED, PRIVATE
  isCloned          Boolean           @default(false) @map("is_cloned")
  originalRoutineId String?           @map("original_routine_id") @db.Uuid
  createdAt         DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt         DateTime          @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  author           User              @relation(fields: [authorId], references: [id])
  routineExercises RoutineExercise[]
  votes            RoutineVote[]
  workouts         Workout[]
  originalRoutine  Routine?          @relation("RoutineClones", fields: [originalRoutineId], references: [id], onDelete: SetNull)
  clonedRoutines   Routine[]         @relation("RoutineClones")

  @@map("routines")
}
```

**Key Features:**

- Twitter-style character limit (140) for titles
- Three visibility levels
- Clone tracking with original routine reference
- Community voting support

### RoutineExercise

Junction table linking routines to exercises with workout details.

```prisma
model RoutineExercise {
  id                 String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  routineId          String   @map("routine_id") @db.Uuid
  exerciseId         Int?     @map("exercise_id")
  customExerciseName String?  @map("custom_exercise_name") // For user-created exercises
  dayIndex           Int      @default(0) @map("day_index") // 0=Monday, 1=Tuesday, etc.
  orderIndex         Int      @default(0) @map("order_index") // Order within day
  sets               String?  // "3", "3-4", "AMRAP", etc.
  reps               String?  // "8", "8-10", "To failure", etc.
  restSeconds        Int?     @map("rest_seconds")
  notes              String?

  // Relations
  exercise  Exercise? @relation(fields: [exerciseId], references: [id])
  routine   Routine   @relation(fields: [routineId], references: [id], onDelete: Cascade)

  @@unique([routineId, dayIndex, orderIndex])
  @@map("routine_exercises")
}
```

**Key Features:**

- Flexible sets/reps as strings (supports ranges, AMRAP, etc.)
- Day-based organization (7-day week)
- Ordering within each day
- Support for both database and custom exercises

### Workout

Individual workout sessions.

```prisma
model Workout {
  id          String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String       @map("user_id") @db.Uuid
  routineId   String?      @map("routine_id") @db.Uuid // Optional - can be ad-hoc workout
  title       String?      @db.VarChar(140)
  visibility  Visibility   @default(PRIVATE)
  startedAt   DateTime     @default(now()) @map("started_at") @db.Timestamptz(6)
  finishedAt  DateTime?    @map("finished_at") @db.Timestamptz(6)

  // Relations
  user        User         @relation(fields: [userId], references: [id])
  routine     Routine?     @relation(fields: [routineId], references: [id])
  workoutSets WorkoutSet[]

  @@map("workouts")
}
```

**Key Features:**

- Optional routine association (supports ad-hoc workouts)
- Start/finish timestamps for duration tracking
- Visibility control for sharing workouts

### WorkoutSet

Individual exercise sets performed in workouts.

```prisma
model WorkoutSet {
  id                           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  workoutId                    String   @map("workout_id") @db.Uuid
  exerciseId                   Int?     @map("exercise_id")
  customExerciseName           String?  @map("custom_exercise_name") @db.VarChar(120)
  customExerciseCategory       String?  @map("custom_exercise_category") @db.VarChar(20)
  customExercisePrimaryMuscles String[] @map("custom_exercise_primary_muscles")
  setNumber                    Int      @default(1) @map("set_number")
  reps                         Int?
  weightKg                     Decimal? @map("weight_kg") @db.Decimal(6, 2) // Supports up to 9999.99 kg
  rpe                          Decimal? @db.Decimal(3, 1) // Rate of Perceived Exertion (1.0-10.0)
  durationSec                  Int?     @map("duration_sec") // For timed exercises
  notes                        String?
  performedAt                  DateTime @default(now()) @map("performed_at") @db.Timestamptz(6)

  // Relations
  workout  Workout   @relation(fields: [workoutId], references: [id])
  exercise Exercise? @relation(fields: [exerciseId], references: [id])

  @@index([workoutId, exerciseId])
  @@index([workoutId, customExerciseName])
  @@map("workout_sets")
}
```

**Key Features:**

- Supports both database and custom exercises
- Precision weight tracking (2 decimal places)
- RPE (Rate of Perceived Exertion) tracking
- Duration tracking for timed exercises
- Performance indexes for fast queries

### UserCustomExercise

User-created custom exercises.

```prisma
model UserCustomExercise {
  id               String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId           String        @map("user_id") @db.Uuid
  name             String        @db.VarChar(120)
  description      String?       @db.Text
  category         ExerciseType  @default(STRENGTH)
  primaryMuscles   String[]      @map("primary_muscles")
  secondaryMuscles String[]      @map("secondary_muscles")
  equipment        String?       @db.VarChar(80)
  instructions     String?       @db.Text
  isPublic         Boolean       @default(false) @map("is_public")
  createdAt        DateTime      @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt        DateTime      @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, name])
  @@map("user_custom_exercises")
}
```

**Key Features:**

- User-specific exercise creation
- Optional public sharing
- Same muscle group structure as database exercises
- Unique constraint prevents duplicate names per user

### RoutineVote

Community voting on public routines.

```prisma
model RoutineVote {
  userId    String   @map("user_id") @db.Uuid
  routineId String   @map("routine_id") @db.Uuid
  value     Int      @db.SmallInt     // Vote value (typically 1 for upvote)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  // Relations
  user    User    @relation(fields: [userId], references: [id])
  routine Routine @relation(fields: [routineId], references: [id])

  @@id([userId, routineId])
  @@index([routineId])
  @@map("routine_votes")
}
```

**Key Features:**

- Composite primary key prevents duplicate votes
- Supports different vote values (extensible for downvotes)
- Index on routineId for fast vote counting

### TokenBlacklist

JWT token blacklist for secure logout.

```prisma
model TokenBlacklist {
  id        String   @id @default(dbgenerated("gen_random_uuid()"))
  token     String   @unique
  userId    String
  expiresAt DateTime @db.Timestamptz(6)
  createdAt DateTime @default(now()) @db.Timestamptz(6)

  @@index([token])
  @@index([expiresAt])
  @@index([userId])
}
```

**Key Features:**

- Secure token invalidation
- Automatic cleanup via expiration timestamps
- Performance indexes for token lookups

---

## Enums

### Visibility

```prisma
enum Visibility {
  PUBLIC    // Visible to everyone
  UNLISTED  // Accessible via direct link only
  PRIVATE   // Only visible to owner
}
```

### ExerciseType

```prisma
enum ExerciseType {
  STRENGTH  // Weight lifting, resistance training
  CARDIO    // Cardiovascular exercises
  MOBILITY  // Stretching, flexibility, mobility
}
```

### Difficulty

```prisma
enum Difficulty {
  BEGINNER     // New to fitness
  INTERMEDIATE // Some experience
  ADVANCED     // Experienced athletes
}
```

### Force

```prisma
enum Force {
  PUSH    // Pushing movements
  PULL    // Pulling movements
  STATIC  // Isometric/static holds
}
```

### Mechanic

```prisma
enum Mechanic {
  COMPOUND   // Multi-joint movements
  ISOLATION  // Single-joint movements
}
```

---

## Relationships

### One-to-Many

- User → Routines
- User → Workouts
- User → CustomExercises
- Routine → RoutineExercises
- Routine → Workouts
- Workout → WorkoutSets
- Exercise → RoutineExercises
- Exercise → WorkoutSets

### Many-to-Many

- Users ↔ Routines (via RoutineVotes)

### Self-Referencing

- Routine → Routine (originalRoutine/clonedRoutines)

---

## Indexes

Performance indexes are strategically placed on:

```sql
-- WorkoutSet indexes for workout queries
@@index([workoutId, exerciseId])
@@index([workoutId, customExerciseName])

-- RoutineVote indexes for voting
@@index([routineId])

-- TokenBlacklist indexes for auth
@@index([token])
@@index([expiresAt])
@@index([userId])
```

---

## Data Types

### UUID Generation

```sql
@default(dbgenerated("gen_random_uuid()"))
```

Uses PostgreSQL's built-in UUID generation for better performance.

### Timestamps

```sql
@db.Timestamptz(6)
```

Timezone-aware timestamps with microsecond precision.

### Decimal Precision

```sql
weightKg: Decimal @db.Decimal(6, 2)  // 9999.99 kg max
rpe: Decimal @db.Decimal(3, 1)       // 10.0 max
```

### Array Fields

```sql
primaryMuscles: String[]  // Native PostgreSQL arrays
```

---

## Migration Strategy

Prisma manages database schema migrations automatically:

```bash
# Generate migration
npx prisma migrate dev --name description

# Deploy to production
npx prisma migrate deploy

# Reset development database
npx prisma migrate reset
```

---

## Sample Queries

### Get User Workouts with Sets

```sql
SELECT w.*, ws.*
FROM workouts w
LEFT JOIN workout_sets ws ON w.id = ws.workout_id
WHERE w.user_id = $1
ORDER BY w.started_at DESC;
```

### Popular Public Routines

```sql
SELECT r.*, COUNT(rv.value) as upvotes
FROM routines r
LEFT JOIN routine_votes rv ON r.id = rv.routine_id
WHERE r.visibility = 'PUBLIC'
GROUP BY r.id
ORDER BY upvotes DESC;
```

### Exercise Search

```sql
SELECT * FROM exercises
WHERE to_tsvector('english', name || ' ' || ARRAY_TO_STRING(primary_muscles, ' '))
@@ plainto_tsquery('english', $1);
```

---

## Best Practices

### Performance

- Use indexes on frequently queried columns
- Avoid N+1 queries with Prisma's `include` and `select`
- Use database-level constraints for data integrity

### Security

- Never expose password hashes in API responses
- Use parameterized queries (Prisma handles this automatically)
- Implement proper authorization checks before data access

### Maintenance

- Regular VACUUM and ANALYZE for PostgreSQL performance
- Monitor query performance with EXPLAIN ANALYZE
- Set up automated backups for production data
