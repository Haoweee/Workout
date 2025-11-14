import { prisma } from './database';
import { ExerciseType, Difficulty, Force, Mechanic } from '@prisma/client';
import { ExerciseResponse } from '@/types';

// Type guards for enum validation
const isValidForce = (value: string): value is Force => {
  return ['PUSH', 'PULL', 'STATIC'].includes(value);
};

const isValidMechanic = (value: string): value is Mechanic => {
  return ['COMPOUND', 'ISOLATION'].includes(value);
};

export interface ExerciseFilters {
  category?: ExerciseType;
  primaryMuscles?: string;
  level?: Difficulty;
  equipment?: string;
  force?: string; // String input from query params, validated against Force enum
  mechanic?: string; // String input from query params, validated against Mechanic enum
  page?: number;
  limit?: number;
  search?: string;
}

export class ExerciseService {
  /**
   * Get all exercises with optional filters and pagination
   */
  static async getAllExercises(filters: ExerciseFilters = {}): Promise<{
    exercises: ExerciseResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const {
      category,
      primaryMuscles,
      level,
      equipment,
      force,
      mechanic,
      page = 1,
      limit = 18,
      search,
    } = filters;

    // Use ranked search when search term is provided
    if (search && search.trim()) {
      return this.searchExercisesWithRanking(search.trim(), filters, page, limit);
    }

    const skip = (page - 1) * limit;

    // Build where clause for basic filtering (no search)
    const whereClause: {
      category?: ExerciseType;
      primaryMuscles?: { has: string };
      level?: Difficulty;
      equipment?: { contains: string; mode: 'insensitive' };
      force?: Force;
      mechanic?: Mechanic;
    } = {};

    if (category) whereClause.category = category;
    if (primaryMuscles) whereClause.primaryMuscles = { has: primaryMuscles };
    if (level) whereClause.level = level;
    if (equipment) whereClause.equipment = { contains: equipment, mode: 'insensitive' };
    if (force && isValidForce(force)) whereClause.force = force;
    if (mechanic && isValidMechanic(mechanic)) whereClause.mechanic = mechanic;

    // Get total count first
    const total = await prisma.exercise.count({ where: whereClause });

    // Always use consistent ordering for pagination
    const rawExercises = await prisma.exercise.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        equipment: true,
        category: true,
        primaryMuscles: true,
        secondaryMuscles: true,
        level: true,
        force: true,
        mechanic: true,
        images: true,
        instructions: true,
        exerciseId: true,
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' }, // Consistent alphabetical ordering
    });

    // Ensure instructions is always string[]
    const exercises: ExerciseResponse[] = rawExercises.map((ex) => ({
      ...ex,
      instructions: Array.isArray(ex.instructions)
        ? ex.instructions
        : ex.instructions
          ? [ex.instructions]
          : [],
    }));

    return {
      exercises,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Advanced search with ranking for better relevance
   */
  static async searchExercisesWithRanking(
    searchTerm: string,
    filters: Partial<ExerciseFilters>,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const { category, primaryMuscles, level, equipment, force, mechanic } = filters;

    // Build base filter conditions
    const baseConditions: string[] = [];
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (category) {
      baseConditions.push(`category = $${paramIndex}::"ExerciseType"`);
      queryParams.push(category);
      paramIndex++;
    }
    if (primaryMuscles) {
      baseConditions.push(`$${paramIndex} = ANY(primary_muscles)`);
      queryParams.push(primaryMuscles);
      paramIndex++;
    }
    if (level) {
      baseConditions.push(`level = $${paramIndex}::"Difficulty"`);
      queryParams.push(level);
      paramIndex++;
    }
    if (equipment) {
      baseConditions.push(`equipment ILIKE $${paramIndex}`);
      queryParams.push(`%${equipment}%`);
      paramIndex++;
    }
    if (force) {
      baseConditions.push(`force = $${paramIndex}::"Force"`);
      queryParams.push(force);
      paramIndex++;
    }
    if (mechanic) {
      baseConditions.push(`mechanic = $${paramIndex}::"Mechanic"`);
      queryParams.push(mechanic);
      paramIndex++;
    }

    const whereClause = baseConditions.length > 0 ? `WHERE ${baseConditions.join(' AND ')}` : '';

    // Add search term parameters
    const searchTermParam = `$${paramIndex}`;
    const searchTermLowerParam = `$${paramIndex + 1}`;
    queryParams.push(searchTerm, searchTerm.toLowerCase());

    // Advanced search query with ranking
    const searchQuery = `
      SELECT
        id, name, equipment, category, primary_muscles as "primaryMuscles",
        secondary_muscles as "secondaryMuscles", level, force, mechanic,
        images, instructions, exercise_id as "exerciseId",
        -- Ranking logic (lower score = higher relevance)
        CASE
          -- Exact name match (highest priority)
          WHEN LOWER(name) = ${searchTermLowerParam} THEN 1
          -- Name starts with search term
          WHEN LOWER(name) LIKE ${searchTermLowerParam} || '%' THEN 2
          -- Primary muscle exact match (high priority for chest, back, etc.)
          WHEN ${searchTermParam} = ANY(primary_muscles) THEN 3
          -- Name contains search term
          WHEN LOWER(name) LIKE '%' || ${searchTermLowerParam} || '%' THEN 4
          -- Secondary muscle exact match (lower priority)
          WHEN ${searchTermParam} = ANY(secondary_muscles) THEN 5
          -- Equipment contains search term
          WHEN LOWER(equipment) LIKE '%' || ${searchTermLowerParam} || '%' THEN 6
          -- Instructions contain search term
          WHEN LOWER(instructions) LIKE '%' || ${searchTermLowerParam} || '%' THEN 7
          ELSE 8
        END as relevance_score
      FROM exercises
      ${whereClause}
      ${whereClause ? 'AND' : 'WHERE'} (
        LOWER(name) LIKE '%' || ${searchTermLowerParam} || '%' OR
        ${searchTermParam} = ANY(primary_muscles) OR
        ${searchTermParam} = ANY(secondary_muscles) OR
        LOWER(equipment) LIKE '%' || ${searchTermLowerParam} || '%' OR
        LOWER(instructions) LIKE '%' || ${searchTermLowerParam} || '%'
      )
      ORDER BY relevance_score ASC, name ASC
      LIMIT ${limit} OFFSET ${skip}
    `;

    // Count query for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM exercises
      ${whereClause}
      ${whereClause ? 'AND' : 'WHERE'} (
        LOWER(name) LIKE '%' || ${searchTermLowerParam} || '%' OR
        ${searchTermParam} = ANY(primary_muscles) OR
        ${searchTermParam} = ANY(secondary_muscles) OR
        LOWER(equipment) LIKE '%' || ${searchTermLowerParam} || '%' OR
        LOWER(instructions) LIKE '%' || ${searchTermLowerParam} || '%'
      )
    `;

    const [exercises, totalResult] = await Promise.all([
      prisma.$queryRawUnsafe(searchQuery, ...queryParams) as Promise<ExerciseResponse[]>,
      prisma.$queryRawUnsafe(countQuery, ...queryParams) as Promise<{ total: bigint }[]>,
    ]);

    const total = Number(totalResult[0]?.total || 0);

    return {
      exercises,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get random exercises with pagination
   */
  static async getRandomExercises(page: number = 1, limit: number = 18) {
    const skip = (page - 1) * limit;
    const total = await prisma.exercise.count();

    // Use a subquery to get random IDs first, then fetch full records
    const randomIds = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM exercises ORDER BY RANDOM() LIMIT ${limit} OFFSET ${skip}
    `;

    if (randomIds.length === 0) {
      return {
        exercises: [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        id: {
          in: randomIds.map((item) => item.id),
        },
      },
      select: {
        id: true,
        name: true,
        equipment: true,
        category: true,
        primaryMuscles: true,
        secondaryMuscles: true,
        level: true,
        force: true,
        mechanic: true,
        images: true,
        instructions: true,
        exerciseId: true,
      },
    });

    return {
      exercises,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get exercise by ID
   */
  static async getExerciseById(id: number) {
    return await prisma.exercise.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        equipment: true,
        category: true,
        primaryMuscles: true,
        secondaryMuscles: true,
        level: true,
        force: true,
        mechanic: true,
        images: true,
        instructions: true,
        exerciseId: true,
      },
    });
  }

  /**
   * Get all unique muscle groups
   */
  static async getMuscleGroups(): Promise<string[]> {
    const result = await prisma.exercise.findMany({
      select: { primaryMuscles: true },
      where: { primaryMuscles: { isEmpty: false } },
    });

    // Flatten all primary muscle arrays and get unique values
    const allMuscles = result.flatMap((r) => r.primaryMuscles);
    return [...new Set(allMuscles)].sort();
  }

  /**
   * Get all unique equipment types
   */
  static async getEquipmentTypes(): Promise<string[]> {
    const result = await prisma.exercise.findMany({
      select: { equipment: true },
      where: { equipment: { not: null } },
      distinct: ['equipment'],
      orderBy: { equipment: 'asc' },
    });

    return result
      .map((r) => r.equipment)
      .filter((equipment): equipment is string => equipment !== null);
  }

  /**
   * Get all unique force types
   */
  static async getForceTypes(): Promise<string[]> {
    const result = await prisma.exercise.findMany({
      select: { force: true },
      where: { force: { not: null } },
      distinct: ['force'],
      orderBy: { force: 'asc' },
    });

    return result.map((r) => r.force).filter((force) => force !== null) as string[];
  }

  /**
   * Get all unique mechanic types
   */
  static async getMechanicTypes(): Promise<string[]> {
    const result = await prisma.exercise.findMany({
      select: { mechanic: true },
      where: { mechanic: { not: null } },
      distinct: ['mechanic'],
      orderBy: { mechanic: 'asc' },
    });

    return result.map((r) => r.mechanic).filter((mechanic) => mechanic !== null) as string[];
  }

  /**
   * Get all available filter options for frontend
   */
  static async getFilterOptions() {
    const [muscleGroups, equipmentTypes, forceTypes, mechanicTypes] = await Promise.all([
      this.getMuscleGroups(),
      this.getEquipmentTypes(),
      this.getForceTypes(),
      this.getMechanicTypes(),
    ]);

    return {
      categories: ['STRENGTH', 'CARDIO', 'MOBILITY'],
      levels: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      muscleGroups,
      equipmentTypes,
      forceTypes,
      mechanicTypes,
    };
  }

  /**
   * Get simple list of exercises (ID and name) for routine creation
   */
  static async getExerciseList() {
    return await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Create new exercise (admin only)
   */
  static async createExercise(data: {
    name: string;
    equipment?: string;
    category?: ExerciseType;
    primaryMuscles?: string[];
    secondaryMuscles?: string[];
    level?: Difficulty;
    force?: string;
    mechanic?: string;
    images?: string[];
    instructions?: string;
    exerciseId?: string;
  }) {
    const createData = {
      name: data.name,
      ...(data.equipment !== undefined && { equipment: data.equipment }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.primaryMuscles !== undefined && { primaryMuscles: data.primaryMuscles }),
      ...(data.secondaryMuscles !== undefined && { secondaryMuscles: data.secondaryMuscles }),
      ...(data.level !== undefined && { level: data.level }),
      ...(data.force !== undefined && isValidForce(data.force) && { force: data.force }),
      ...(data.mechanic !== undefined &&
        isValidMechanic(data.mechanic) && { mechanic: data.mechanic }),
      ...(data.images !== undefined && { images: data.images }),
      ...(data.instructions !== undefined && { instructions: data.instructions }),
      ...(data.exerciseId !== undefined && { exerciseId: data.exerciseId }),
    };

    return await prisma.exercise.create({
      data: createData,
      select: {
        id: true,
        name: true,
        equipment: true,
        category: true,
        primaryMuscles: true,
        secondaryMuscles: true,
        level: true,
        force: true,
        mechanic: true,
        images: true,
        instructions: true,
        exerciseId: true,
      },
    });
  }

  /**
   * Update exercise (admin only)
   */
  static async updateExercise(
    id: number,
    data: {
      name?: string;
      equipment?: string;
      category?: ExerciseType;
      primaryMuscles?: string[];
      secondaryMuscles?: string[];
      level?: Difficulty;
      force?: string;
      mechanic?: string;
      images?: string[];
      instructions?: string;
      exerciseId?: string;
    }
  ) {
    const updateData = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.equipment !== undefined && { equipment: data.equipment }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.primaryMuscles !== undefined && { primaryMuscles: data.primaryMuscles }),
      ...(data.secondaryMuscles !== undefined && { secondaryMuscles: data.secondaryMuscles }),
      ...(data.level !== undefined && { level: data.level }),
      ...(data.force !== undefined && isValidForce(data.force) && { force: data.force }),
      ...(data.mechanic !== undefined &&
        isValidMechanic(data.mechanic) && { mechanic: data.mechanic }),
      ...(data.images !== undefined && { images: data.images }),
      ...(data.instructions !== undefined && { instructions: data.instructions }),
      ...(data.exerciseId !== undefined && { exerciseId: data.exerciseId }),
    };

    return await prisma.exercise.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        equipment: true,
        category: true,
        primaryMuscles: true,
        secondaryMuscles: true,
        level: true,
        force: true,
        mechanic: true,
        images: true,
        instructions: true,
        exerciseId: true,
      },
    });
  }

  /**
   * Delete exercise (admin only)
   */
  static async deleteExercise(id: number) {
    return await prisma.exercise.delete({
      where: { id },
    });
  }
}
