import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Scale, Shield, Trash2 } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { PrivacyPolicy } from '@/features/marketing/legal/privacy-policy';
import { TermsOfService } from '@/features/marketing/legal/tos';
import { DataDeletion } from '@/features/marketing/legal/data-deletion';

export const LegalPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('privacy-policy');

  // Initialize active tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['privacy-policy', 'terms-of-service', 'data-deletion'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL with the selected tab
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex flex-row gap-4 bg-transparent p-0 h-auto border-b border-gray-200 w-full rounded-none">
              <TabsTrigger
                value="privacy-policy"
                className="px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:font-bold rounded-none pb-3 pt-3"
              >
                <Shield className="w-4 h-4 mr-1" />
                Privacy Policy
              </TabsTrigger>
              <TabsTrigger
                value="terms-of-service"
                className="px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:font-bold rounded-none pb-3 pt-3"
              >
                <Scale className="w-4 h-4 mr-1" />
                Terms of Service
              </TabsTrigger>
              <TabsTrigger
                value="data-deletion"
                className="px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:font-bold rounded-none pb-3 pt-3"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Data Deletion
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="privacy-policy" className="mt-0">
                <PrivacyPolicy />
              </TabsContent>

              <TabsContent value="terms-of-service" className="mt-0">
                <TermsOfService />
              </TabsContent>

              <TabsContent value="data-deletion" className="mt-0">
                <DataDeletion />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
