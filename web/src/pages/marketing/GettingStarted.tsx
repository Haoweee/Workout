import { useState } from 'react';
import { Play, CheckCircle, Clock, Users, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tutorials = [
  {
    id: 1,
    title: 'Getting Started with Workout Tracker',
    description: 'Learn the basics of using our workout tracking platform',
    duration: '5 min',
    level: 'Beginner',
    category: 'Basics',
    videoUrl: '#',
    steps: [
      'Create your account and set up your profile',
      'Explore the exercise database',
      'Create your first workout routine',
      'Start tracking your workouts',
    ],
    completed: false,
  },
  {
    id: 2,
    title: 'Creating Your First Routine',
    description: 'Step-by-step guide to building effective workout routines',
    duration: '8 min',
    level: 'Beginner',
    category: 'Routines',
    videoUrl: '#',
    steps: [
      'Navigate to the routine builder',
      'Select exercises from the database',
      'Set appropriate sets, reps, and rest times',
      'Save and organize your routine',
    ],
    completed: false,
  },
  {
    id: 3,
    title: 'Tracking Your Workouts',
    description: 'Learn how to log workouts and monitor your progress',
    duration: '6 min',
    level: 'Beginner',
    category: 'Tracking',
    videoUrl: '#',
    steps: [
      'Start a new workout session',
      'Log sets, reps, and weights',
      'Use the timer for rest periods',
      'Review your workout summary',
    ],
    completed: false,
  },
];

const categories = ['All', 'Basics', 'Routines', 'Tracking'];

const levelColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export const GettingStartedPage = () => {
  const [selectedCategory] = useState('All');
  const [completedTutorials, setCompletedTutorials] = useState<Set<number>>(new Set());

  const filteredTutorials = tutorials.filter(
    (tutorial) => selectedCategory === 'All' || tutorial.category === selectedCategory
  );

  const toggleComplete = (tutorialId: number) => {
    const newCompleted = new Set(completedTutorials);
    if (newCompleted.has(tutorialId)) {
      newCompleted.delete(tutorialId);
    } else {
      newCompleted.add(tutorialId);
    }
    setCompletedTutorials(newCompleted);
  };

  const completionRate = Math.round((completedTutorials.size / tutorials.length) * 100);
  const isCompleted = completedTutorials.size === tutorials.length;

  return (
    <div className="py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Getting Started</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master your fitness journey with our comprehensive video tutorials and step-by-step guides
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Progress Overview */}
          <div className="flex-1">
            <Card className={`h-full${isCompleted ? ' bg-green-50' : ''}`}>
              <CardContent className="pt-4 h-full flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-500">
                    {completedTutorials.size}/{tutorials.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{completionRate}% Complete</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="h-full">
              <CardContent className="pt-2 h-full flex flex-col justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">{tutorials.length}</p>
                    <p className="text-sm text-gray-500">Total Tutorials</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="pt-2 h-full flex flex-col justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">{completedTutorials.size}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="pt-2 h-full flex flex-col justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-sm text-gray-500">Total Minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="pt-2 h-full flex flex-col justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">{categories.length - 1}</p>
                    <p className="text-sm text-gray-500">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {/* <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div> */}

      {/* Tutorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial) => (
          <Card
            key={tutorial.id}
            className={`relative transition-all duration-200 hover:shadow-lg ${
              completedTutorials.has(tutorial.id) ? 'bg-green-50 border-green-200' : ''
            }`}
          >
            {/* Completion Badge */}
            {completedTutorials.has(tutorial.id) && (
              <div className="absolute top-4 right-4 z-10">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            )}

            <CardHeader className="space-y-3">
              {/* Video Thumbnail Placeholder */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Play className="h-12 w-12 text-gray-400" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={levelColors[tutorial.level as keyof typeof levelColors]}
                  >
                    {tutorial.level}
                  </Badge>
                  <Badge variant="outline">{tutorial.category}</Badge>
                </div>

                <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {tutorial.duration}
                </div>
              </div>

              {/* Tutorial Steps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">What you'll learn:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tutorial.steps.slice(0, 3).map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 shrink-0" />
                      {step}
                    </li>
                  ))}
                  {tutorial.steps.length > 3 && (
                    <li className="text-gray-500">+{tutorial.steps.length - 3} more steps</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Tutorial
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleComplete(tutorial.id)}>
                  {completedTutorials.has(tutorial.id) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
