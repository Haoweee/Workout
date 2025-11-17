import { execSync } from 'child_process';

export default function globalTeardown() {
  console.log('🧹 Cleaning up test environment...');

  try {
    // Extract database name from DATABASE_URL, fallback to local default
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://haowee:@localhost:5432/chi_test';
    const dbName = databaseUrl.split('/').pop()?.split('?')[0] || 'chi_test';

    // Only drop database locally, not in CI
    if (!process.env.CI) {
      execSync(`dropdb ${dbName}`, { stdio: 'ignore' });
      console.log('🗑️ Test database dropped');
    } else {
      console.log('🗑️ Running in CI, skipping database cleanup');
    }
  } catch (error) {
    console.log('⚠️ Could not drop test database (might not exist)');
  }

  console.log('✅ Test cleanup complete');
}
