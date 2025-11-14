import { useState, useCallback, useEffect } from 'react';
import { routineTemplates, exerciseDefaults } from '@/constants/routine-templates';
import type { Routine } from '@/types/api';

interface Exercise {
  id: string | number;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  isCustom?: boolean;
}

interface Day {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface RoutineFormData {
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | '';
  visibility: 'PUBLIC' | 'PRIVATE' | '';
}

export const useRoutineForm = (mode: 'create' | 'edit', existingRoutine?: Routine) => {
  // Basic form state
  const [formData, setFormData] = useState<RoutineFormData>({
    title: mode === 'edit' ? existingRoutine?.title || '' : '',
    description: mode === 'edit' ? existingRoutine?.description || '' : '',
    difficulty: mode === 'edit' ? existingRoutine?.difficulty || '' : '',
    visibility: mode === 'edit' ? existingRoutine?.visibility || '' : '',
  });

  // Day management
  const [days, setDays] = useState<Day[]>([{ id: 'day-1', name: 'Day 1', exercises: [] }]);
  const [currentDayId, setCurrentDayId] = useState('day-1');
  const [showTemplates, setShowTemplates] = useState(mode === 'create');

  // Initialize form with existing routine data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && existingRoutine) {
      setShowTemplates(false);

      // Group exercises by day
      const dayMap = new Map<number, Exercise[]>();

      existingRoutine.routineExercises?.forEach((routineExercise) => {
        const dayIndex = routineExercise.dayIndex;
        if (!dayMap.has(dayIndex)) {
          dayMap.set(dayIndex, []);
        }

        dayMap.get(dayIndex)!.push({
          id: routineExercise.customExerciseName
            ? `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            : routineExercise.exercise?.id || routineExercise.exerciseId || 'unknown',
          name:
            routineExercise.customExerciseName ||
            routineExercise.exercise?.name ||
            'Unknown Exercise',
          sets: routineExercise.sets || '',
          reps: routineExercise.reps || '',
          rest: routineExercise.restSeconds?.toString() || '',
          isCustom: !!routineExercise.customExerciseName,
        });
      });

      // Convert to days array
      const newDays = Array.from(dayMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([dayIndex, exercises]) => ({
          id: `day-${dayIndex + 1}`,
          name: `Day ${dayIndex + 1}`,
          exercises,
        }));

      if (newDays.length > 0) {
        setDays(newDays);
        setCurrentDayId(newDays[0].id);
      }
    }
  }, [mode, existingRoutine]);

  // Update form data
  const updateFormData = useCallback((field: keyof RoutineFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Quick add exercise with smart defaults
  const quickAddExercise = useCallback(
    (exerciseName: string, isCustom = false) => {
      const exerciseKey = exerciseName.toLowerCase();
      const defaults = exerciseDefaults[exerciseKey] || {
        sets: '3',
        reps: '8-12',
        rest: '90',
      };

      const newExercise: Exercise = {
        id: isCustom
          ? `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          : exerciseName,
        name: exerciseName,
        sets: defaults.sets,
        reps: defaults.reps,
        rest: defaults.rest,
        isCustom,
      };

      setDays((prev) =>
        prev.map((day) =>
          day.id === currentDayId ? { ...day, exercises: [...day.exercises, newExercise] } : day
        )
      );
    },
    [currentDayId]
  );

  // Load template
  const loadTemplate = useCallback((templateId: string) => {
    const template = routineTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const newDays = template.days.map((templateDay, index) => ({
      id: `day-${index + 1}`,
      name: templateDay.name,
      exercises: templateDay.exercises.map((exercise, exerciseIndex) => ({
        id: `template-${templateId}-${index}-${exerciseIndex}`,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        rest: exercise.rest,
        isCustom: false,
      })),
    }));

    setDays(newDays);
    setCurrentDayId(newDays[0].id);
    setShowTemplates(false);
    setFormData((prev) => ({ ...prev, title: template.name }));
  }, []);

  // Add new day
  const addDay = useCallback(() => {
    const newDayNumber = days.length + 1;
    const newDay = {
      id: `day-${newDayNumber}`,
      name: `Day ${newDayNumber}`,
      exercises: [],
    };
    setDays((prev) => [...prev, newDay]);
    setCurrentDayId(newDay.id);
  }, [days.length]);

  // Remove day
  const removeDay = useCallback(
    (dayId: string) => {
      if (days.length <= 1) return; // Don't remove the last day

      const newDays = days.filter((day) => day.id !== dayId);
      setDays(newDays);

      if (currentDayId === dayId) {
        setCurrentDayId(newDays[0].id);
      }
    },
    [days, currentDayId]
  );

  // Update exercise inline
  const updateExercise = useCallback(
    (exerciseId: string | number, field: string, value: string) => {
      setDays((prev) =>
        prev.map((day) => ({
          ...day,
          exercises: day.exercises.map((exercise) =>
            exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise
          ),
        }))
      );
    },
    []
  );

  // Remove exercise
  const removeExercise = useCallback((exerciseId: string | number) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        exercises: day.exercises.filter((exercise) => exercise.id !== exerciseId),
      }))
    );
  }, []);

  // Convert to API format
  const toApiFormat = useCallback(() => {
    const exercises: Array<{
      exerciseId?: number;
      customExerciseName?: string;
      dayIndex: number;
      orderIndex: number;
      sets?: string;
      reps?: string;
      restSeconds?: number;
    }> = [];

    days.forEach((day, dayIndex) => {
      day.exercises.forEach((exercise, orderIndex) => {
        const exerciseData = {
          dayIndex,
          orderIndex,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.rest ? parseInt(exercise.rest, 10) : undefined,
        };

        if (exercise.isCustom || typeof exercise.id === 'string') {
          exercises.push({
            ...exerciseData,
            customExerciseName: exercise.name,
          });
        } else {
          exercises.push({
            ...exerciseData,
            exerciseId: Number(exercise.id),
          });
        }
      });
    });

    return {
      title: formData.title,
      description: formData.description || undefined,
      difficulty: formData.difficulty || undefined,
      visibility: formData.visibility as 'PUBLIC' | 'PRIVATE',
      exercises,
    };
  }, [formData, days]);

  return {
    // Form data
    formData,
    updateFormData,

    // Day management
    days,
    currentDayId,
    setCurrentDayId,
    addDay,
    removeDay,

    // Exercise management
    quickAddExercise,
    updateExercise,
    removeExercise,

    // Template management
    showTemplates,
    setShowTemplates,
    loadTemplate,

    // API conversion
    toApiFormat,
  };
};
