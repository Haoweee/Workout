import React from 'react';

import { Button } from '@/components/ui/button';

import type { DayTabsProps } from '@/types/routine';

export const DayTabs: React.FC<DayTabsProps> = ({
  days,
  currentDayId,
  onDaySelect,
  onAddDay,
  onRemoveDay,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <div key={day.id} className="relative">
              <Button
                type="button"
                variant={currentDayId === day.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onDaySelect(day.id)}
                className={`${days.length > 1 ? 'pr-8' : ''}`}
              >
                {day.name}
                {day.exercises.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                    {day.exercises.length}
                  </span>
                )}
              </Button>
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDay(day.id);
                  }}
                  className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAddDay} className="text-xs">
          + Add Day
        </Button>
      </div>
    </div>
  );
};
