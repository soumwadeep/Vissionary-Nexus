#!/usr/bin/env node
/**
 * Codebase Model Audit Report
 * Verifies all AI model references are using Nemotron 550B
 * 
 * Run: npm run audit:models
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ModelReference {
  file: string;
  line: number;
  content: string;
  type: 'nemotron' | 'other' | 'config' | 'metadata';
}

const NEMOTRON_FULL = 'nvidia/nemotron-3-ultra-550b-a55b';
const NEMOTRON_SHORT = 'nemotron';

async function auditModels() {
  console.log('🔍 Codebase Model Audit Report');
  console.log('━'.repeat(70));
  console.log(`Target Model: ${NEMOTRON_FULL}`);
  console.log(`Scan Date: ${new Date().toISOString()}`);
  console.log('━'.repeat(70));

  const nemotronRefs: ModelReference[] = [];
  const otherModels: ModelReference[] = [];
  const configRefs: ModelReference[] = [];

  try {
    // Search 1: Nemotron references
    console.log('\n📊 Searching for model references...');

    const result = await execAsync(
      `grep -r "nemotron\\|NVIDIA_MODEL\\|nvidia/" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null || true`,
      { maxBuffer: 1024 * 1024 * 10 }
    );

    const lines = result.stdout.split('\n').filter(l => l.trim());

    // Parse results
    for (const line of lines) {
      const match = line.match(/^([^:]+):(.+)/);
      if (!match) continue;

      const [, file, content] = match;
      const relFile = file.replace(process.cwd(), '').replace(/\\/g, '/');

      // Skip node_modules, .next, etc.
      if (relFile.includes('node_modules') || relFile.includes('.next') || relFile.includes('dist')) {
        continue;
      }

      if (content.includes('nemotron')) {
        nemotronRefs.push({
          file: relFile,
          line: 0,
          content: content.trim(),
          type: 'nemotron',
        });
      } else if (content.includes('NVIDIA_MODEL') || content.includes('nvidia/')) {
        configRefs.push({
          file: relFile,
          line: 0,
          content: content.trim(),
          type: 'config',
        });
      }
    }

    // Summary
    console.log(`\n✅ Nemotron References: ${nemotronRefs.length}`);
    nemotronRefs.slice(0, 5).forEach(ref => {
      console.log(`   ${ref.file}`);
    });
    if (nemotronRefs.length > 5) {
      console.log(`   ... and ${nemotronRefs.length - 5} more`);
    }

    console.log(`\n⚙️  Configuration References: ${configRefs.length}`);
    configRefs.slice(0, 5).forEach(ref => {
      console.log(`   ${ref.file}`);
    });
    if (configRefs.length > 5) {
      console.log(`   ... and ${configRefs.length - 5} more`);
    }

    // Check for incompatible models
    const incompatibleSearch = await execAsync(
      `grep -r "llama\\|claude\\|gpt\\|ANTHROPIC\\|OPENAI" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null || true`,
      { maxBuffer: 1024 * 1024 * 10 }
    ).catch(() => ({ stdout: '' }));

    const incompatible = incompatibleSearch.stdout
      .split('\n')
      .filter(l => l.trim() && !l.includes('node_modules') && !l.includes('.next'));

    if (incompatible.length === 0) {
      console.log(`\n✅ No Incompatible Models: All references checked - CLEAR`);
    } else {
      console.log(`\n⚠️  Found ${incompatible.length} potential issues:`);
      incompatible.slice(0, 5).forEach(line => {
        console.log(`   ${line.substring(0, 100)}`);
      });
    }

    // Check environment variable configuration
    console.log('\n📋 Environment Configuration');
    console.log('━'.repeat(70));
    const envExample = `
NVIDIA_API_KEY=nvapi-xxx              # Add from https://build.nvidia.com/
NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
`;
    console.log('Recommended .env.local:');
    console.log(envExample);

    // API endpoints using the model
    console.log('🔗 API Endpoints Using Nemotron');
    console.log('━'.repeat(70));
    const endpoints = [
      'GET /api/ai/health - Health check',
      'POST /api/ai/tasks - Task planning',
      'POST /api/ai/mentor - Mentor assistance',
      'POST /api/ai/recommendations - AI recommendations',
      'POST /api/ai/super-agent - Super agent',
      'GET /api/test-nvidia/credential-test - Credential verification',
      'GET /api/team-match/recommendations - Team matching',
    ];
    endpoints.forEach(ep => console.log(`   ${ep}`));

    // Final verdict
    console.log('\n' + '━'.repeat(70));
    if (nemotronRefs.length > 0 && incompatible.length === 0) {
      console.log('✅ AUDIT PASSED - Codebase is fully configured for Nemotron 550B');
      console.log('\nNext Steps:');
      console.log('  1. Set NVIDIA_API_KEY in .env.local');
      console.log('  2. Run: npm run dev');
      console.log('  3. Test: npm run test:nvidia');
      process.exit(0);
    } else {
      console.log('⚠️  AUDIT NEEDS REVIEW - Check incompatible models above');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Audit Error:', error.message);
    process.exit(1);
  }
}

auditModels();
