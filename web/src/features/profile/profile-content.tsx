import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TableProperties, Dumbbell } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRoutines } from '@/hooks/useRoutines';

import { WorkoutsTab } from '@/components/profile/workouts';
import { RoutinesTab } from '@/components/profile/routines';

export const ProfileContent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Use hooks directly in component
  const {
    routines,
    isLoading: routinesLoading,
    error: routinesError,
    hasInitialized,
    fetchUserRoutines,
    refreshRoutines,
  } = useRoutines(false); // Don't auto-fetch

  const tabFromUrl = searchParams.get('tab') || 'profile?tab=workouts';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const urlTab = searchParams.get('tab') || 'profile';
    // Only update if there's actually a difference to prevent unnecessary re-renders
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    if (activeTab === 'routines' && !hasInitialized) {
      fetchUserRoutines();
    }
  }, [activeTab, hasInitialized, fetchUserRoutines]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex flex-row gap-4 bg-transparent p-0 h-auto border-b border-gray-200 w-full md:w-fit rounded-none">
        <TabsTrigger
          value="workouts"
          className="px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:font-bold rounded-none pb-3 pt-3"
        >
          <Dumbbell className="w-4 h-4 mr-1" />
          Workouts
        </TabsTrigger>
        <TabsTrigger
          value="routines"
          className="px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:font-bold rounded-none pb-3 pt-3"
        >
          <TableProperties className="w-4 h-4 mr-1" />
          Routines
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <WorkoutsTab />

        <RoutinesTab
          routines={routines}
          refreshRoutines={refreshRoutines}
          isLoading={routinesLoading}
          error={routinesError}
        />
      </div>
    </Tabs>
  );
};
