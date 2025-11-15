# pnpm tests is wrong on prod server

pnpm test

> workout-app@1.0.0 test /var/www/Workout
> pnpm --filter server test && pnpm --filter web test
> server@1.0.0 test /var/www/Workout/server
> NODE_ENV=test jest --watchAll=false

Determining test suites to run...🔧 Setting up test environment...
📦 Creating test database...
📦 Test database already exists or error creating it
🔄 Running test database migrations...
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "chi_test", schema "public" at "localhost:5432"

Error: P1000: Authentication failed against database server, the provided database credentials for `haowee` are not valid.

Please make sure to provide valid database credentials for the database server at the configured address.
❌ Failed to setup test environment: Error: Command failed: npx prisma migrate deploy
at genericNodeError (node:internal/errors:983:15)
at wrappedFn (node:internal/errors:537:14)
at checkExecSyncError (node:child*process:916:11)
at execSync (node:child_process:988:15)
at globalSetup (/var/www/Workout/server/tests/globalSetup.ts:21:38)
at /var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3*/node_modules/@jest/core/build/index.js:3166:17
at ScriptTransformer.requireAndTranspileModule (/var/www/Workout/node_modules/.pnpm/@jest+transform@30.2.0/node_modules/@jest/transform/build/index.js:623:24)
at async runGlobalHook (/var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3*/node_modules/@jest/core/build/index.js:3162:9)
at async runJest (/var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3*/node_modules/@jest/core/build/index.js:3429:5)
at async \_run10000 (/var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3*/node_modules/@jest/core/build/index.js:1543:5) {
status: 1,
signal: null,
output: [ null, null, null ],
pid: 47429,
stdout: null,
stderr: null
}
Error: Command failed: npx prisma migrate deploy
at genericNodeError (node:internal/errors:983:15)
at wrappedFn (node:internal/errors:537:14)
at checkExecSyncError (node:child_process:916:11)
at execSync (node:child_process:988:15)
at globalSetup (/var/www/Workout/server/tests/globalSetup.ts:21:38)
at /var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3*/node_modules/@jest/core/build/index.js:3166:17
at ScriptTransformer.requireAndTranspileModule (/var/www/Workout/node_modules/.pnpm/@jest+transform@30.2.0/node_modules/@jest/transform/build/index.js:623:24)
at async runGlobalHook (/var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3*/node_modules/@jest/core/build/index.js:3162:9)
at async runJest (/var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3*/node_modules/@jest/core/build/index.js:3429:5)
at async \_run10000 (/var/www/Workout/node_modules/.pnpm/@jest+core@30.2.0_ts-node@10.9.2*@types+node@20.19.25_typescript@5.3.3\_/node_modules/@jest/core/build/index.js:1543:5)
/var/www/Workout/server:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  server@1.0.0 test: `NODE_ENV=test jest --watchAll=false`
Exit status 1
 ELIFECYCLE  Test failed. See above for more details.
