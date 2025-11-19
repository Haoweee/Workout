import { Link } from 'react-router-dom';

import {
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Wifi,
  Smartphone,
  MessageSquare,
  Search,
  CheckCircle,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const TroubleshootingPage = () => {
  const troubleshootingCategories = [
    {
      icon: AlertCircle,
      title: 'Login & Authentication',
      description: 'Issues accessing your workout tracker account',
      items: [
        'Forgot password? Use the "Reset Password" link on the login page',
        'Account locked? Wait 15 minutes or contact support',
        'Email not recognized? Check for typos or try alternate email',
        'Two-factor authentication not working? Use backup codes',
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Wifi,
      title: 'Sync & Connectivity',
      description: 'Problems with data synchronization',
      items: [
        'Check your internet connection stability',
        'Force sync by pulling down on the main screen',
        'Log out and log back in to refresh connection',
        'Clear app cache and restart the application',
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Smartphone,
      title: 'App Performance',
      description: 'Crashes, freezing, or slow performance',
      items: [
        'Update to the latest version of the app',
        'Restart your device to free up memory',
        'Clear browser cache and cookies (web version)',
        'Close other apps to free up system resources',
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: RefreshCw,
      title: 'Missing Data',
      description: 'Workouts, routines, or progress not showing',
      items: [
        "Check if you're logged into the correct account",
        'Verify your internet connection and try syncing',
        'Look in "Recently Deleted" if available',
        'Contact support with your account details for data recovery',
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Search,
      title: 'Exercise Database',
      description: 'Problems finding or using exercises',
      items: [
        'Use different search terms or browse by muscle group',
        'Check if exercise filters are limiting results',
        'Try creating a custom exercise if not found',
        'Report missing exercises to help expand our database',
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: MessageSquare,
      title: 'Other Issues',
      description: 'Need help with something else?',
      items: [
        'Check our FAQ section for quick answers',
        'Visit the Getting Started guide for tutorials',
        'Join our community forum for user tips',
        'Contact support for personalized assistance',
      ],
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-4xl font-bold text-gray-900">Troubleshooting</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get back to crushing your workouts! Find quick solutions to common issues and keep your
          fitness journey on track.
        </p>
        <Badge variant="outline" className="text-sm">
          We're here to help you succeed
        </Badge>
      </div>

      {/* Quick Tips Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Quick Tip:</strong> Most issues can be resolved by updating the app, checking your
          internet connection, or logging out and back in.
        </AlertDescription>
      </Alert>

      {/* Troubleshooting Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {troubleshootingCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.title} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Support Section */}
      <Card className="bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <MessageSquare className="h-5 w-5" />
            Still Need Help?
          </CardTitle>
          <CardDescription className="text-green-700">
            Our support team is ready to help you get back to your workouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Live Chat</p>
              <p className="text-xs text-green-700">Available 9 AM - 6 PM EST</p>
            </div> */}
            <Link to="/help-center" className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Help Center</p>
              <p className="text-xs text-green-700">Browse all articles</p>
            </Link>
            <Link to="/contact" className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Contact</p>
              <p className="text-xs text-green-700">Get in touch with us</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
