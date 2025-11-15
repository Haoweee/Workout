import { execSync } from 'child_process';

export default function globalSetup() {
  console.log('🔧 Setting up test environment...');

  // Set test environment
  process.env.NODE_ENV = 'test';

  // Use DATABASE_URL from environment, fallback to local default
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://haowee:@localhost:5432/chi_test';
  process.env.DATABASE_URL = databaseUrl;

  // Extract database name from URL for createdb command
  const dbName = databaseUrl.split('/').pop()?.split('?')[0] || 'chi_test';

  try {
    // Create test database if it doesn't exist
    console.log('📦 Creating test database...');

    // In CI, the database is already created by the service
    // Only try to create it locally
    if (process.env.CI) {
      console.log('📦 Running in CI, skipping database creation');
    } else {
      execSync(`createdb ${dbName}`, { stdio: 'ignore' });
    }
  } catch (error) {
    // Database might already exist, that's okay
    console.log('📦 Test database already exists or error creating it');
  }

  try {
    // Run migrations on test database
    console.log('🔄 Running test database migrations...');
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    console.log('✅ Test environment setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}
