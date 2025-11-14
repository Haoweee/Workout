import { execSync } from 'child_process';

export default function globalTeardown() {
  console.log('🧹 Cleaning up test environment...');

  try {
    // Drop test database
    execSync('dropdb chi_test', { stdio: 'ignore' });
    console.log('🗑️ Test database dropped');
  } catch (error) {
    console.log('⚠️ Could not drop test database (might not exist)');
  }

  console.log('✅ Test cleanup complete');
}
