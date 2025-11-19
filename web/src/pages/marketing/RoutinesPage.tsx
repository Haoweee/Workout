import { useState } from 'react';
import { Plus, Clock, Target, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { routineTemplates } from '@/constants/routine-templates';

const difficultyLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const categories = ['All', 'Strength', 'HIIT', 'Flexibility'];

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

export const RoutinesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = routineTemplates.filter((template) => {
    const matchesDifficulty =
      selectedDifficulty === 'All' || template.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesDifficulty && matchesCategory;
  });

  const handleUseTemplate = (templateId: string) => {
    if (isAuthenticated) {
      navigate(`/routines/create?template=${templateId}`);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Workout Routines</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover proven workout routines crafted by fitness experts. Whether you're a beginner or
          advanced athlete, find the perfect routine to match your goals.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Button
            size="lg"
            onClick={() => (isAuthenticated ? navigate('/routines/create') : navigate('/signup'))}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Custom Routine
          </Button>
          <Button variant="outline" size="lg">
            Browse Exercises
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Difficulty Level</h3>
          <div className="flex flex-wrap gap-2">
            {difficultyLevels.map((level) => (
              <Button
                key={level}
                variant={selectedDifficulty === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Category</h3>
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </div>

      {/* Routine Templates */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Routine Templates</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      difficultyColors[template.difficulty as keyof typeof difficultyColors]
                    }
                  >
                    {template.difficulty}
                  </Badge>
                </div>

                {/* Rating and Users */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {template.users?.toLocaleString()}
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-full">
                {/* Workout Days Preview */}
                <div className="space-y-3 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Workout Split:</h4>
                  <div className="space-y-2">
                    {template.days.slice(0, 2).map((day, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-gray-700">{day.name}</div>
                        <div className="text-gray-500 text-xs">
                          {day.exercises
                            .slice(0, 3)
                            .map((ex) => ex.name)
                            .join(', ')}
                          {day.exercises.length > 3 && ` +${day.exercises.length - 3} more`}
                        </div>
                      </div>
                    ))}
                    {template.days.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{template.days.length - 2} more workout
                        {template.days.length > 3 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom section - Duration/Target and Buttons */}
                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t mt-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {template.description.includes('min')
                        ? template.description.split('•')[1]?.trim()
                        : 'Varies'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {template.days.length} day{template.days.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      {isAuthenticated ? 'Use Template' : 'Sign Up to Use'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 pt-8 border-t">
        <h2 className="text-2xl font-bold text-gray-900">Ready to Start Your Fitness Journey?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join thousands of users who have transformed their fitness with our proven workout
          routines. Start tracking your progress today.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate(isAuthenticated ? '/routines/create' : '/signup')}
          >
            {isAuthenticated ? 'Create Your Routine' : 'Get Started Free'}
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/exercises')}>
            Explore Exercises
          </Button>
        </div>
      </div>
    </div>
  );
};
