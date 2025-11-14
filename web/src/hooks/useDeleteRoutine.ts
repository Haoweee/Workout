import { routineService } from '@/services';

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
