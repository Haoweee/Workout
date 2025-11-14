import React from 'react';
import { RoutineForm } from '@/features/routine/routine-form';

/**
 * Create Routine Page Component
 *
 * A page for creating new workout routines
 */
export const CreateRoutinePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <RoutineForm mode="create" />
    </div>
  );
};
