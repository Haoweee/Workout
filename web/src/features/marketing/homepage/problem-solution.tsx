import GoogleSheetsPlannerImg from '../../../assets/marketing/google-sheets-planner.webp';
import WorkoutPlannerImg from '../../../assets/marketing/workout-planner.webp';

import { ThumbsUpIcon, ThumbsDownIcon, MoveRightIcon, MoveDownIcon } from '@/components/ui/icons';

export const ProblemSolution = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <ThumbsDownIcon className="text-red-300" />
          <ThumbsUpIcon className="text-green-300" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Problem vs Solution</h1>
        <p>Tracking workouts is frustrating and time-consuming.</p>
        <p>With Workouts, it's easy and efficient.</p>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center gap-4">
        <div className="w-full lg:flex-1 border border-gray-200 rounded-xl shadow-md">
          <img
            src={GoogleSheetsPlannerImg}
            alt="Google Sheets Workout Planner"
            className="w-full h-auto rounded-xl"
          />
        </div>
        <MoveRightIcon className="hidden md:block w-5 h-5" />
        <MoveDownIcon className="md:hidden w-4 h-4" />
        <div className="w-full lg:flex-1 border border-gray-200 rounded-xl shadow-md">
          <img
            src={WorkoutPlannerImg}
            alt="Workout Planner App"
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
