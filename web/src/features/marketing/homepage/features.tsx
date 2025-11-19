import CreateRoutineImg from '../../../assets/marketing/create-routine.png';
import StartWorkoutImg from '../../../assets/marketing/start-workout.png';
import LogExercisesImg from '../../../assets/marketing/log-exercises.png';
import TrackProgressImg from '../../../assets/marketing/workout-planner.png';

import { PencilRuler, Hammer, CirclePlay, ScrollText, ListPlus } from 'lucide-react';

import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Features = () => {
  return (
    <div className="space-y-4">
      <PencilRuler className="mx-auto mb-4 text-blue-300" />
      <h1 className="text-center text-xl font-semibold mb-2">How it Works</h1>
      <p className="text-center mb-8">
        Workouts simplifies your fitness journey in four easy steps:
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="">
          <CardTitle className="pl-6 flex flex-row items-center gap-2">
            1. <Hammer size={16} /> Create a Routine
          </CardTitle>
          <CardDescription className="pl-6">
            Design custom workout routines tailored to your fitness goals.
          </CardDescription>
          <CardContent className="">
            <img
              src={CreateRoutineImg}
              alt="Create Routine"
              className="w-full h-auto mb-4 rounded-lg"
            />
          </CardContent>
        </Card>
        <Card>
          <CardTitle className="pl-6 flex flex-row items-center gap-2">
            2. <CirclePlay size={16} /> Start a Workout
          </CardTitle>
          <CardDescription className="pl-6">
            Start your workout with your pre-built routine, exercises, and timers.
          </CardDescription>
          <CardContent className="">
            <img
              src={StartWorkoutImg}
              alt="Start a Workout"
              className="w-full h-auto mb-4 rounded-lg"
            />
          </CardContent>
        </Card>
        <Card>
          <CardTitle className="pl-6 flex flex-row items-center gap-2">
            3. <ScrollText size={16} /> Log your exercises
          </CardTitle>
          <CardDescription className="pl-6">
            Log exercises, sets, reps, and weights with a user-friendly interface.
          </CardDescription>
          <CardContent>
            <img
              src={LogExercisesImg}
              alt="Log your Exercises"
              className="w-full h-auto mb-4 rounded-lg"
            />
          </CardContent>
        </Card>
        <Card>
          <CardTitle className="pl-6 flex flex-row items-center gap-2">
            4. <ListPlus size={16} /> Track your progress
          </CardTitle>
          <CardDescription className="pl-6">
            Keep track of your progress and stay motivated.
          </CardDescription>
          <CardContent>
            <img
              src={TrackProgressImg}
              alt="Track your Progress"
              className="w-full h-auto mb-4 rounded-lg"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
