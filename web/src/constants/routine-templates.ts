import { Activity, Clock, Target } from 'lucide-react';

// Smart defaults for common exercises
export const exerciseDefaults: Record<string, { sets: string; reps: string; rest: string }> = {
  'bench press': { sets: '3', reps: '8-10', rest: '120' },
  squat: { sets: '3', reps: '8-12', rest: '180' },
  deadlift: { sets: '3', reps: '5-8', rest: '180' },
  'pull-up': { sets: '3', reps: '6-10', rest: '90' },
  'push-up': { sets: '3', reps: '10-15', rest: '60' },
  plank: { sets: '3', reps: '30-60s', rest: '60' },
  'bicep curl': { sets: '3', reps: '10-12', rest: '60' },
  'tricep extension': { sets: '3', reps: '10-12', rest: '60' },
  'shoulder press': { sets: '3', reps: '8-10', rest: '90' },
  'leg press': { sets: '3', reps: '12-15', rest: '120' },
  running: { sets: '1', reps: '20-30min', rest: '0' },
  cycling: { sets: '1', reps: '30-45min', rest: '0' },
};

// Popular exercise templates
export const routineTemplates = [
  {
    id: 'full-body',
    name: 'Full Body',
    description: '3 day routine • 60 min',
    rating: 4.8,
    users: 1250,
    category: 'Strength',
    difficulty: 'Beginner',
    days: [
      {
        name: 'Full Body A',
        exercises: [
          { name: 'Squats', sets: '3', reps: '8-12', rest: '120' },
          { name: 'Bench Press', sets: '3', reps: '8-10', rest: '120' },
          { name: 'Bent Over Row', sets: '3', reps: '8-10', rest: '90' },
          { name: 'Shoulder Press', sets: '3', reps: '8-10', rest: '90' },
        ],
      },
      {
        name: 'Full Body B',
        exercises: [
          { name: 'Deadlifts', sets: '3', reps: '5-8', rest: '180' },
          { name: 'Pull-ups', sets: '3', reps: '6-10', rest: '90' },
          { name: 'Dips', sets: '3', reps: '8-12', rest: '90' },
          { name: 'Leg Press', sets: '3', reps: '12-15', rest: '120' },
        ],
      },
      {
        name: 'Full Body C',
        exercises: [
          { name: 'Front Squats', sets: '3', reps: '8-10', rest: '120' },
          { name: 'Incline Press', sets: '3', reps: '8-10', rest: '120' },
          { name: 'Lat Pulldown', sets: '3', reps: '10-12', rest: '90' },
          { name: 'Plank', sets: '3', reps: '30-60s', rest: '60' },
        ],
      },
    ],
  },
  {
    id: 'push-pull-legs',
    name: 'Push/Pull/Legs',
    description: '3 day split • 45 min',
    rating: 4.9,
    users: 1250,
    category: 'Hypertrophy',
    difficulty: 'Intermediate',
    days: [
      {
        name: 'Push Day',
        exercises: [
          { name: 'Bench Press', sets: '3', reps: '8-10', rest: '120' },
          { name: 'Shoulder Press', sets: '3', reps: '8-10', rest: '90' },
          { name: 'Tricep Extension', sets: '3', reps: '10-12', rest: '60' },
          { name: 'Push-ups', sets: '3', reps: '10-15', rest: '60' },
        ],
      },
      {
        name: 'Pull Day',
        exercises: [
          { name: 'Pull-ups', sets: '3', reps: '6-10', rest: '90' },
          { name: 'Bent Over Row', sets: '3', reps: '8-10', rest: '90' },
          { name: 'Bicep Curl', sets: '3', reps: '10-12', rest: '60' },
          { name: 'Face Pulls', sets: '3', reps: '12-15', rest: '60' },
        ],
      },
      {
        name: 'Leg Day',
        exercises: [
          { name: 'Squats', sets: '3', reps: '8-12', rest: '180' },
          { name: 'Deadlifts', sets: '3', reps: '5-8', rest: '180' },
          { name: 'Leg Press', sets: '3', reps: '12-15', rest: '120' },
          { name: 'Calf Raises', sets: '3', reps: '15-20', rest: '60' },
        ],
      },
    ],
  },

  {
    id: 'upper-lower',
    name: 'Upper/Lower Split',
    description: '4 day split • 50 min',
    difficulty: 'Intermediate',
    category: 'Strength',
    rating: 4.8,
    users: 1250,
    days: [
      {
        name: 'Upper Body A',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '6-8', rest: '120' },
          { name: 'Bent Over Row', sets: '4', reps: '6-8', rest: '120' },
          { name: 'Shoulder Press', sets: '3', reps: '8-10', rest: '90' },
          { name: 'Pull-ups', sets: '3', reps: 'AMRAP', rest: '90' },
        ],
      },
      {
        name: 'Lower Body A',
        exercises: [
          { name: 'Squats', sets: '4', reps: '6-8', rest: '180' },
          { name: 'Romanian Deadlift', sets: '3', reps: '8-10', rest: '120' },
          { name: 'Leg Press', sets: '3', reps: '12-15', rest: '90' },
          { name: 'Calf Raises', sets: '4', reps: '15-20', rest: '60' },
        ],
      },
    ],
  },
  {
    id: 'cardio-blast',
    name: 'HIIT Cardio Blast',
    description: '30 min • High intensity',
    difficulty: 'Beginner',
    category: 'HIIT',
    rating: 4.6,
    users: 890,
    days: [
      {
        name: 'HIIT Circuit',
        exercises: [
          { name: 'Jumping Jacks', sets: '4', reps: '30s', rest: '15' },
          { name: 'Burpees', sets: '4', reps: '30s', rest: '15' },
          { name: 'Mountain Climbers', sets: '4', reps: '30s', rest: '15' },
          { name: 'High Knees', sets: '4', reps: '30s', rest: '15' },
        ],
      },
    ],
  },
  {
    id: 'flexibility-flow',
    name: 'Daily Flexibility Flow',
    description: '20 min • Recovery focused',
    difficulty: 'Beginner',
    category: 'Flexibility',
    rating: 4.7,
    users: 650,
    days: [
      {
        name: 'Flexibility Routine',
        exercises: [
          { name: 'Cat-Cow Stretch', sets: '1', reps: '10', rest: '0' },
          { name: 'Child Pose', sets: '1', reps: '60s', rest: '0' },
          { name: 'Downward Dog', sets: '1', reps: '30s', rest: '0' },
          { name: 'Pigeon Pose', sets: '1', reps: '30s each', rest: '0' },
        ],
      },
    ],
  },
];

// Popular exercises for quick add
export const popularExercises = [
  { name: 'Bench Press', icon: Activity },
  { name: 'Squats', icon: Activity },
  { name: 'Deadlifts', icon: Activity },
  { name: 'Pull-ups', icon: Activity },
  { name: 'Push-ups', icon: Activity },
  { name: 'Shoulder Press', icon: Activity },
  { name: 'Bicep Curls', icon: Activity },
  { name: 'Plank', icon: Clock },
  { name: 'Running', icon: Target },
  { name: 'Cycling', icon: Target },
];
