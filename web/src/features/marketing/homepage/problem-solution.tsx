import GoogleSheetsPlannerImg from '../../../assets/marketing/google-sheets-planner.png';
import WorkoutPlannerImg from '../../../assets/marketing/workout-planner.png';

import { ThumbsUp, ThumbsDown, MoveRight, MoveDown } from 'lucide-react';

export const ProblemSolution = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <ThumbsDown className="text-red-300" />
          <ThumbsUp className="text-green-300" />
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
        <MoveRight size={20} className="hidden md:block" />
        <MoveDown size={16} className="md:hidden" />
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
