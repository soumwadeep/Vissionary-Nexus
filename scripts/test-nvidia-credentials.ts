#!/usr/bin/env node
/**
 * CLI Test Runner for NVIDIA Credential/Model Compatibility
 * 
 * Usage:
 *   npx ts-node scripts/test-nvidia-credentials.ts
 *   npm run test:nvidia
 */

async function testNvidiaCredentials() {
  const baseUrl = process.env.API_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/test-nvidia/credential-test`;

  console.log("🔍 Testing NVIDIA Credential/Model Compatibility");
  console.log(`📍 Endpoint: ${endpoint}`);
  console.log(`⏱️  Bounded Timeout: 15s`);
  console.log("━".repeat(60));

  const startTime = Date.now();

  try {
    const response = await fetch(endpoint);
    const result = await response.json();

    const elapsedMs = Date.now() - startTime;

    // Pretty print based on result
    if (result.success) {
      console.log("✅ SUCCESS - Credentials and Model Compatible");
      console.log(`   Model: ${result.model}`);
      console.log(`   Response: "${result.content}"`);
      console.log(`   Usage: ${result.usage.prompt_tokens} prompt, ${result.usage.completion_tokens} completion`);
      console.log(`   Duration: ${result.durationMs}ms`);
      console.log(`   Total (incl. network): ${elapsedMs}ms`);
    } else {
      console.log(`❌ FAILED - ${result.error}`);
      console.log(`   Message: ${result.message}`);

      if (result.httpStatus) {
        console.log(`   HTTP Status: ${result.httpStatus}`);
      }

      if (result.timeout) {
        console.log(`   Timeout: ${result.timeout}ms`);
      }

      if (result.errorName) {
        console.log(`   Error Type: ${result.errorName}`);
      }

      if (result.apiErrorDetails && Object.keys(result.apiErrorDetails).length > 0) {
        console.log(`   API Details: ${JSON.stringify(result.apiErrorDetails)}`);
      }

      console.log(`   Duration: ${result.durationMs}ms`);
    }

    console.log("━".repeat(60));

    // Return appropriate exit code
    if (result.success) {
      console.log("✨ All tests passed!");
      process.exit(0);
    } else {
      console.log("⚠️  Test failed - check configuration");
      process.exit(1);
    }
  } catch (error: any) {
    console.error("❌ Network Error:", error.message);
    console.log("━".repeat(60));
    console.log("💡 Check if:");
    console.log("   - Development server is running (npm run dev)");
    console.log("   - API_URL environment variable is set correctly");
    console.log("   - NVIDIA_API_KEY is configured in .env.local");
    process.exit(1);
  }
}

// Run the test
testNvidiaCredentials();
