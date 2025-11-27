import { User, Shield, Bell, Trash2, Key, Globe } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AccountSettingsPage = () => {
  const settingsSections = [
    {
      icon: User,
      title: 'Profile Information',
      description: 'Manage your personal details and workout preferences',
      items: [
        'Update your name, email, and bio',
        'Upload a custom profile avatar',
        'Set your fitness goals and experience level',
        'Configure default workout units (kg/lbs, km/miles)',
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Key,
      title: 'Security & Authentication',
      description: 'Keep your workout data secure',
      items: [
        'Change your account password',
        'Enable two-factor authentication',
        'Review active sessions and devices',
        'Set up security questions for recovery',
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Shield,
      title: 'Privacy & Sharing',
      description: 'Control who can see your fitness journey',
      items: [
        'Set your profile visibility (public/private)',
        'Manage workout sharing preferences',
        'Control who can see your progress stats',
        'Configure routine sharing permissions',
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay motivated with personalized reminders',
      items: [
        'Workout reminder notifications',
        'Weekly progress summary emails',
        'Achievement and milestone alerts',
        'Rest day and recovery reminders',
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Globe,
      title: 'Data & Sync',
      description: 'Manage your workout data across devices',
      items: [
        'Export your workout history and progress',
        'Sync settings across all your devices',
        'Backup and restore your routines',
        'Data retention preferences',
      ],
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Trash2,
      title: 'Account Management',
      description: 'Advanced account options',
      items: [
        'Temporarily deactivate your account',
        'Download all your fitness data',
        'Permanently delete your account',
        'Transfer data to another account',
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-4xl font-bold text-gray-900">Account Settings</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Customize your workout tracking experience and manage your fitness data with complete
          control over your privacy and preferences.
        </p>
        <Badge variant="outline" className="text-sm">
          Your data, your rules
        </Badge>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, index) => (
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

      {/* Quick Access Section */}
      {/* <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Camera className="h-5 w-5" />
            Quick Access
          </CardTitle>
          <CardDescription className="text-blue-700">
            Most commonly accessed settings for your workout tracker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Update Profile</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Key className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Change Password</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Privacy Settings</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium">Notifications</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};
