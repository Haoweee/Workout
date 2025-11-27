import React from 'react';

import { Plus, Clock, Target, Users, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

import { routineTemplates } from '@/constants/routine-templates';

import type { TemplateSelectorProps } from '@/types/routine';

import { getDifficultyColor } from '@/utils';

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect,
  onStartFromScratch,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Create New Routine</h1>

      {/* Quick Start Templates */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="relative">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {routineTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="flex flex-col hover:shadow-lg transition-all duration-200 flex-none w-80 h-105"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getDifficultyColor(template.difficulty)}
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
                      {/* Duration and Target */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                        <div className="flex items-center gap-1 ">
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
                          onClick={() => onTemplateSelect(template.id)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card
          className="w-full h-[200px] p-6 cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2 mt-4"
          onClick={onStartFromScratch}
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Plus className="h-8 w-8 mb-2" />
            <h3 className="font-semibold">Start from scratch</h3>
            <p className="text-sm text-center">Build your own routine</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
