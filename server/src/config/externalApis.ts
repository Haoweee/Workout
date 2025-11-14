/**
 * External API Configuration                       (THIS IS JUST AN EXAMPLE)
 * Add these to your .env file
 */

// Weather API (OpenWeatherMap)
// WEATHER_API_KEY=your_openweather_api_key

// Exercise API (API Ninjas)
// EXERCISE_API_KEY=your_api_ninjas_key

// OAuth (GitHub)
// GITHUB_CLIENT_ID=your_github_client_id
// GITHUB_CLIENT_SECRET=your_github_client_secret

// Payment (Stripe)
// STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
// STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

// Email (SendGrid)
// SENDGRID_API_KEY=your_sendgrid_api_key
// FROM_EMAIL=noreply@yourdomain.com

// Other useful APIs
// GOOGLE_MAPS_API_KEY=your_google_maps_key
// FIREBASE_SERVER_KEY=your_firebase_server_key
// TWILIO_ACCOUNT_SID=your_twilio_account_sid
// TWILIO_AUTH_TOKEN=your_twilio_auth_token

export interface ExternalApiConfig {
  weather: {
    apiKey: string;
    baseUrl: string;
  };
  exercise: {
    apiKey: string;
    baseUrl: string;
  };
  github: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret?: string;
  };
  sendgrid: {
    apiKey: string;
    fromEmail: string;
  };
}

export const externalApiConfig: ExternalApiConfig = {
  weather: {
    apiKey: process.env.WEATHER_API_KEY || '',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  },
  exercise: {
    apiKey: process.env.EXERCISE_API_KEY || '',
    baseUrl: 'https://api.api-ninjas.com/v1',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    redirectUri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    ...(process.env.STRIPE_WEBHOOK_SECRET && { webhookSecret: process.env.STRIPE_WEBHOOK_SECRET }),
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@workout.com',
  },
};

// Validation function to check if required API keys are present
export const validateApiConfig = (): { isValid: boolean; missing: string[] } => {
  const missing: string[] = [];

  if (!externalApiConfig.weather.apiKey) missing.push('WEATHER_API_KEY');
  if (!externalApiConfig.exercise.apiKey) missing.push('EXERCISE_API_KEY');
  if (!externalApiConfig.github.clientId) missing.push('GITHUB_CLIENT_ID');
  if (!externalApiConfig.github.clientSecret) missing.push('GITHUB_CLIENT_SECRET');
  if (!externalApiConfig.stripe.secretKey) missing.push('STRIPE_SECRET_KEY');
  if (!externalApiConfig.sendgrid.apiKey) missing.push('SENDGRID_API_KEY');

  return {
    isValid: missing.length === 0,
    missing,
  };
};
