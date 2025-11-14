import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { routineTemplates } from '@/constants/routine-templates';

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  onStartFromScratch: () => void;
}

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
        <div className="">
          <div className="w-full flex flex-row overflow-x-auto gap-4 mb-8">
            {routineTemplates.map((template) => (
              <Card
                key={template.id}
                className="w-1/3 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onTemplateSelect(template.id)}
              >
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <div className="text-xs text-gray-500">
                  {template.days.length} days •{' '}
                  {template.days.reduce((total, day) => total + day.exercises.length, 0)} exercises
                </div>
              </Card>
            ))}
          </div>

          <Card
            className="w-full h-[200px] p-6 cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2"
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
    </div>
  );
};
