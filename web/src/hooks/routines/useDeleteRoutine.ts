import { routineService } from '@/services';

/**
 * Custom hook to delete a routine by its ID
 * @returns An object containing the deleteRoutine function
 *
 * @example
 * const { deleteRoutine } = useDeleteRoutine();
 */
export const useDeleteRoutine = () => {
  const deleteRoutine = async (id: string) => {
    try {
      const response = await routineService.deleteRoutine(id);
      return await response;
    } catch (error) {
      console.error('Error deleting routine:', error);
      throw error;
    }
  };

  return { deleteRoutine };
};
