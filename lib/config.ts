// Centralized configuration management

export const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Firebase
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },

  // App Settings
  app: {
    name: 'Polaris MotoGP',
    version: '2.2.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Betting Limits
  betting: {
    minBet: 50,
    maxBet: 500,
    maxOdds: 5.0,
    maxPayoutPerBet: 2500,
    maxDailyPayout: 10000,
    maxMarketExposure: 50000,
  },

  // Performance
  performance: {
    enableOptimisticUI: true,
    enableLazyLoading: true,
    enableMemoization: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
  },

  // Monitoring
  monitoring: {
    enableLogging: true,
    enableErrorTracking: true,
    enablePerformanceTracking: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  },

  // Features
  features: {
    enableParlays: true,
    enableLiveBetting: false, // Not implemented yet
    enableCashout: false, // Not implemented yet
    enableNotifications: false, // Not implemented yet
  },

  // API
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000,
  },
} as const;

// Validate required environment variables
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }
}

// Get config value safely
export function getConfig<K extends keyof typeof config>(key: K): typeof config[K] {
  return config[key];
}

export default config;
