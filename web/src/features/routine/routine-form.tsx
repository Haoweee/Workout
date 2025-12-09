import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertMessage } from '@/components/errors/alert-message';
import { Button } from '@/components/ui/button';
import { ErrorToast } from '@/components/errors/toast';

import { ExerciseBuilder } from './routine-exercise-builder';
import { RoutineBasicInfo } from './routine-basic-info';
import { TemplateSelector } from './routine-template-selector';

import { useCreateRoutine, useRoutineForm, useUpdateRoutine } from '@/hooks/routines';

import type { Routine, RoutineFormProps } from '@/types/routine';

export const RoutineForm: React.FC<RoutineFormProps> = ({ mode, existingRoutine, onSuccess }) => {
  const navigate = useNavigate();

  const { createRoutine, isLoading: isCreatingRoutine, createError } = useCreateRoutine();

  const { updateRoutine, isLoading: isUpdatingRoutine, updateError } = useUpdateRoutine();

  const {
    formData,
    updateFormData,
    days,
    currentDayId,
    setCurrentDayId,
    addDay,
    removeDay,
    quickAddExercise,
    updateExercise,
    removeExercise,
    showTemplates,
    setShowTemplates,
    loadTemplate,
    toApiFormat,
  } = useRoutineForm(mode, existingRoutine);

  // Handle form submission
  const handleSubmitRoutine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      ErrorToast({
        message: 'Validation Error',
        description: 'Please enter a routine title.',
      });
      return;
    }

    if (!formData.visibility) {
      ErrorToast({
        message: 'Validation Error',
        description: 'Please select routine visibility.',
      });
      return;
    }

    const routineData = toApiFormat();

    let result: Routine | null = null;

    try {
      if (mode === 'create') {
        if (routineData.difficulty) {
          result = await createRoutine(routineData);
        }
      } else if (mode === 'edit' && existingRoutine) {
        result = await updateRoutine(existingRoutine.id, routineData);
      }

      if (result) {
        if (onSuccess) {
          onSuccess(result);
        } else {
          navigate(`/routines/${result.id}`);
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    loadTemplate(templateId);
  };

  const handleStartFromScratch = () => {
    setShowTemplates(false);
  };

  // Show template selector for create mode
  if (showTemplates && mode === 'create') {
    return (
      <TemplateSelector
        onTemplateSelect={handleTemplateSelect}
        onStartFromScratch={handleStartFromScratch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        {mode === 'create' ? 'Create New Routine' : 'Edit Routine'}
      </h1>

      <form onSubmit={handleSubmitRoutine} className="space-y-6">
        {/* Basic Information */}
        <RoutineBasicInfo
          title={formData.title}
          description={formData.description}
          difficulty={formData.difficulty}
          visibility={formData.visibility}
          onTitleChange={(value) => updateFormData('title', value)}
          onDescriptionChange={(value) => updateFormData('description', value)}
          onDifficultyChange={(value) => updateFormData('difficulty', value)}
          onVisibilityChange={(value) => updateFormData('visibility', value)}
        />

        {/* Exercise Builder */}
        <ExerciseBuilder
          days={days}
          currentDayId={currentDayId}
          onCurrentDayChange={setCurrentDayId}
          onAddExercise={quickAddExercise}
          onUpdateExercise={updateExercise}
          onRemoveExercise={removeExercise}
          onAddDay={addDay}
          onRemoveDay={removeDay}
          onShowTemplates={() => setShowTemplates(true)}
          onDaysChange={() => {}} // Not needed with current implementation
        />

        {/* Error Display */}
        {(createError || updateError) && (
          <AlertMessage message={createError || updateError || ''} type="error" />
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isCreatingRoutine || isUpdatingRoutine}
            className="flex-1"
          >
            {isCreatingRoutine || isUpdatingRoutine
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Routine'
                : 'Update Routine'}
          </Button>

          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
