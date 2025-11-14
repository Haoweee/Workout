import { execSync } from 'child_process';

export default function globalSetup() {
  console.log('🔧 Setting up test environment...');

  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://haowee:@localhost:5432/chi_test';

  try {
    // Create test database if it doesn't exist
    console.log('📦 Creating test database...');
    execSync('createdb chi_test', { stdio: 'ignore' });
  } catch (error) {
    // Database might already exist, that's okay
    console.log('📦 Test database already exists or error creating it');
  }

  try {
    // Run migrations on test database
    console.log('🔄 Running test database migrations...');
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'postgresql://haowee:@localhost:5432/chi_test' },
    });

    console.log('✅ Test environment setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}
