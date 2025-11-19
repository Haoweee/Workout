import { Link } from 'react-router-dom';
import { Sparkle, CircleUser, Bug, Scale } from 'lucide-react';

import { Card } from '@/components/ui/card';

export const RecommendedTopics = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Recommended Topics</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/getting-started">
          <Card className="p-6 gap-2 place-items-center text-center hover:shadow-md transition-shadow">
            <Sparkle className="h-6 w-6 text-yellow-400" />
            <span>Getting Started</span>
            <span className="text-sm text-gray-400">Learn how to use the platform</span>
          </Card>
        </Link>
        <Link to="/account-settings">
          <Card className="p-6 gap-2 place-items-center text-center hover:shadow-md transition-shadow">
            <CircleUser className="h-6 w-6 text-orange-600" />
            <span>Account & Settings</span>
            <span className="text-sm text-gray-400">Manage your account and preferences</span>
          </Card>
        </Link>
        <Link to="/troubleshooting">
          <Card className="p-6 gap-2 place-items-center text-center hover:shadow-md transition-shadow">
            <Bug className="h-6 w-6 text-green-600" />
            <span>Troubleshooting</span>
            <span className="text-sm text-gray-400">Find solutions to common issues</span>
          </Card>
        </Link>
        <Link to="/legal">
          <Card className="p-6 gap-2 place-items-center text-center hover:shadow-md transition-shadow">
            <Scale className="h-6 w-6 text-blue-600" />
            <span>Legal</span>
            <span className="text-sm text-gray-400">
              Privacy Policy, Terms of Service, and more
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
};
