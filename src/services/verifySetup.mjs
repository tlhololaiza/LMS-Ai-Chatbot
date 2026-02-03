#!/usr/bin/env node

/**
 * Quick Setup Verification Script
 * Checks if all prerequisites for API client testing are met
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 API Client Setup Verification\n');
console.log('═'.repeat(50));

let allChecksPass = true;

// Check 1: Frontend .env file
console.log('\n📁 Check 1: Frontend Environment Variables');
const frontendEnvPath = join(rootDir, '.env');
if (existsSync(frontendEnvPath)) {
  const envContent = readFileSync(frontendEnvPath, 'utf-8');
  if (envContent.includes('VITE_API_URL')) {
    const match = envContent.match(/VITE_API_URL=(.+)/);
    const url = match ? match[1].trim() : '';
    console.log(`   ✅ .env exists`);
    console.log(`   ✅ VITE_API_URL = ${url}`);
  } else {
    console.log(`   ❌ .env exists but missing VITE_API_URL`);
    allChecksPass = false;
  }
} else {
  console.log(`   ❌ .env file not found`);
  console.log(`   Create .env with: VITE_API_URL=http://localhost:4000`);
  allChecksPass = false;
}

// Check 2: Backend .env file
console.log('\n📁 Check 2: Backend Environment Variables');
const backendEnvPath = join(rootDir, 'server', '.env');
if (existsSync(backendEnvPath)) {
  const envContent = readFileSync(backendEnvPath, 'utf-8');
  console.log(`   ✅ server/.env exists`);
  
  if (envContent.includes('GOOGLE_GEMINI_API_KEY')) {
    const match = envContent.match(/GOOGLE_GEMINI_API_KEY=(.+)/);
    const key = match ? match[1].trim() : '';
    if (key && key !== 'your_api_key_here' && key.length > 20) {
      console.log(`   ✅ GOOGLE_GEMINI_API_KEY is set (${key.substring(0, 10)}...)`);
    } else {
      console.log(`   ⚠️  GOOGLE_GEMINI_API_KEY is not configured`);
      console.log(`   Get your key at: https://makersuite.google.com/app/apikey`);
      allChecksPass = false;
    }
  } else {
    console.log(`   ❌ Missing GOOGLE_GEMINI_API_KEY`);
    allChecksPass = false;
  }
} else {
  console.log(`   ❌ server/.env file not found`);
  console.log(`   Copy server/.env.example to server/.env and add your API key`);
  allChecksPass = false;
}

// Check 3: API Client file
console.log('\n📄 Check 3: API Client Files');
const apiClientPath = join(rootDir, 'src', 'services', 'apiClient.ts');
if (existsSync(apiClientPath)) {
  console.log(`   ✅ src/services/apiClient.ts exists`);
  const content = readFileSync(apiClientPath, 'utf-8');
  if (content.includes('sendMessage') && content.includes('streamMessage')) {
    console.log(`   ✅ sendMessage() function found`);
    console.log(`   ✅ streamMessage() function found`);
  }
} else {
  console.log(`   ❌ src/services/apiClient.ts not found`);
  allChecksPass = false;
}

// Check 4: Test files
console.log('\n🧪 Check 4: Test Files');
const testPath = join(rootDir, 'src', 'services', 'apiClient.test.ts');
const standaloneTestPath = join(rootDir, 'src', 'services', 'testApiClient.ts');

if (existsSync(testPath)) {
  console.log(`   ✅ apiClient.test.ts exists`);
} else {
  console.log(`   ⚠️  apiClient.test.ts not found`);
}

if (existsSync(standaloneTestPath)) {
  console.log(`   ✅ testApiClient.ts exists`);
} else {
  console.log(`   ⚠️  testApiClient.ts not found`);
}

// Check 5: Dependencies
console.log('\n📦 Check 5: Dependencies');
const packageJsonPath = join(rootDir, 'package.json');
if (existsSync(packageJsonPath)) {
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  if (pkg.devDependencies?.tsx || pkg.dependencies?.tsx) {
    console.log(`   ✅ tsx is installed`);
  } else {
    console.log(`   ⚠️  tsx not found (needed for test:api-client script)`);
  }
  
  if (pkg.scripts?.['test:api-client']) {
    console.log(`   ✅ test:api-client script configured`);
  } else {
    console.log(`   ⚠️  test:api-client script not found in package.json`);
  }
}

const serverPackageJsonPath = join(rootDir, 'server', 'package.json');
if (existsSync(serverPackageJsonPath)) {
  const serverPkg = JSON.parse(readFileSync(serverPackageJsonPath, 'utf-8'));
  
  if (serverPkg.dependencies?.['@google/generative-ai']) {
    console.log(`   ✅ @google/generative-ai is installed`);
  } else {
    console.log(`   ❌ @google/generative-ai not found in server`);
    allChecksPass = false;
  }
}

// Check 6: Server endpoints
console.log('\n🌐 Check 6: Server Implementation');
const serverIndexPath = join(rootDir, 'server', 'index.ts');
if (existsSync(serverIndexPath)) {
  const serverContent = readFileSync(serverIndexPath, 'utf-8');
  
  if (serverContent.includes('/api/chat')) {
    console.log(`   ✅ /api/chat endpoint implemented`);
  } else {
    console.log(`   ❌ /api/chat endpoint missing`);
    allChecksPass = false;
  }
  
  if (serverContent.includes('/api/chat/stream')) {
    console.log(`   ✅ /api/chat/stream endpoint implemented`);
  } else {
    console.log(`   ❌ /api/chat/stream endpoint missing`);
    allChecksPass = false;
  }
  
  if (serverContent.includes('/api/health')) {
    console.log(`   ✅ /api/health endpoint implemented`);
  } else {
    console.log(`   ⚠️  /api/health endpoint missing (optional)`);
  }
}

// Summary
console.log('\n' + '═'.repeat(50));
if (allChecksPass) {
  console.log('\n✅ All checks passed! You\'re ready to test the API client.\n');
  console.log('Next steps:');
  console.log('  1. Start the server:  cd server && npm run dev');
  console.log('  2. Run tests:         npm run test:api-client');
  console.log('  3. Check the guide:   See API_CLIENT_TESTING.md\n');
} else {
  console.log('\n⚠️  Some checks failed. Please review the issues above.\n');
  console.log('See API_CLIENT_TESTING.md for detailed setup instructions.\n');
  process.exit(1);
}
