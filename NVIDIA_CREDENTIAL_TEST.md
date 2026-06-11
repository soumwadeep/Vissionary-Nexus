# NVIDIA Credential & Model Compatibility Test Setup

## Overview

This document explains how to test NVIDIA API credential validity and Nemotron model reachability with a bounded 15-second timeout.

## Prerequisites

1. **NVIDIA API Key**: Get from https://build.nvidia.com/
2. **Nemotron Model Access**: Request access to `nvidia/nemotron-3-ultra-550b-a55b`
3. **Node.js 18+**: For running the development server and test script
4. **Environment Variables**: Configure `.env.local`

## Setup Steps

### 1. Get NVIDIA API Key

1. Go to https://build.nvidia.com/
2. Sign up or log in
3. Navigate to "API Keys" in your account settings
4. Create a new API key for the NVIDIA AI Foundation Models
5. Copy the key (you won't see it again)

### 2. Configure Environment

Create or update `.env.local` in the project root:

```env
# NVIDIA Configuration
NVIDIA_API_KEY=your-actual-api-key-here
NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b

# Optional: API base URL for testing
API_URL=http://localhost:3000
```

**⚠️ Important**: Never commit `.env.local` to version control!

### 3. Start Development Server

```bash
npm run dev
```

Server will be available at `http://localhost:3000`

### 4. Run Credential Test

**Option A: CLI (Recommended)**
```bash
npm run test:nvidia
```

**Option B: cURL**
```bash
curl http://localhost:3000/api/test-nvidia/credential-test | jq
```

**Option C: Browser**
Navigate to: `http://localhost:3000/api/test-nvidia/credential-test`

## Test Results

### ✅ Success Case
Credentials are valid and Nemotron is reachable:
```json
{
  "success": true,
  "error": null,
  "model": "nvidia/nemotron-3-ultra-550b-a55b",
  "content": "OK",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 2,
    "total_tokens": 12
  },
  "durationMs": 2345
}
```

### ❌ Failure Cases

**Missing API Key**
```json
{
  "success": false,
  "error": "MISSING_API_KEY",
  "message": "NVIDIA_API_KEY environment variable is not set"
}
```
*Fix*: Set NVIDIA_API_KEY in .env.local

**Authorization Failure** (401/403)
```json
{
  "success": false,
  "error": "AUTHORIZATION_FAILED",
  "message": "Unauthorized: API key is invalid or expired",
  "httpStatus": 401
}
```
*Fix*: Verify API key at https://build.nvidia.com/

**Inference Timeout** (>15s)
```json
{
  "success": false,
  "error": "INFERENCE_TIMEOUT",
  "message": "Nemotron inference did not respond within 15000ms",
  "timeout": 15000,
  "durationMs": 15001
}
```
*Fix*: 
- Check NVIDIA API status at https://status.nvidia.com/
- Retry after waiting
- Verify model has quota remaining

**API Error** (5xx)
```json
{
  "success": false,
  "error": "API_ERROR",
  "message": "NVIDIA API returned 503",
  "httpStatus": 503
}
```
*Fix*: Check NVIDIA API status and retry

**Network Error**
```json
{
  "success": false,
  "error": "NETWORK_ERROR",
  "message": "fetch failed",
  "errorName": "TypeError"
}
```
*Fix*:
- Verify internet connection
- Check firewall/proxy settings
- Verify NVIDIA API endpoint is reachable

## Bounded Timeout Explanation

The test uses a **15-second bounded timeout** via JavaScript `AbortController`:

```
Timeline:
0s    ─────────── Request sent to NVIDIA
      │
5s    │ (typical response time)
      │
10s   │
      │
15s   └─────────── Timeout fires (AbortError)
      │
      └─ Request aborted, endpoint returns INFERENCE_TIMEOUT
```

### Why 15 seconds?

- **Too short (<5s)**: May abort valid slow responses
- **Just right (15s)**: Catches service issues while allowing legitimate delays
- **Too long (>60s)**: User perceives as hung/broken

### Timeout is NOT retried

Unlike the main `callNVIDIA()` function in [lib/ai/client.ts](../../lib/ai/client.ts) which retries on timeout, the credential test performs a **single attempt**:

- Timeout = service is slow/unavailable
- Single attempt helps distinguish from transient network issues
- Retries are handled at a higher level if needed

## Architecture

```
User/Test Script
      │
      ├─ npm run test:nvidia
      │       │
      │       ▼
      │   scripts/test-nvidia-credentials.ts
      │       │
      │       ▼ fetch()
      │
      HTTP Request (GET)
      │
      ▼
http://localhost:3000/api/test-nvidia/credential-test
      │
      ├─ Check: NVIDIA_API_KEY exists?
      │   └─ If no: return MISSING_API_KEY
      │
      ├─ Create AbortController (15s timeout)
      │
      ├─ POST to https://integrate.api.nvidia.com/v1/chat/completions
      │   ├─ Model: nvidia/nemotron-3-ultra-550b-a55b
      │   ├─ Message: "Say 'OK' and nothing else."
      │   ├─ Max tokens: 10
      │   └─ Auth: Bearer ${NVIDIA_API_KEY}
      │
      ├─ Wait for response (max 15s)
      │   ├─ If 401/403: return AUTHORIZATION_FAILED
      │   ├─ If 5xx: return API_ERROR
      │   ├─ If success: return SUCCESS
      │   └─ If AbortError: return INFERENCE_TIMEOUT
      │
      └─ Return to caller with results
```

## Troubleshooting

### "API key is not set"
- Confirm `.env.local` exists in project root
- Verify `NVIDIA_API_KEY=xxx` format
- Restart dev server after adding to .env
- Check for typos: `NVIDIA_API_KEY` (not `NVIDIA_KEY`)

### "Unauthorized" (401)
- Verify API key is valid at https://build.nvidia.com/
- Check if key has expired (regenerate if needed)
- Ensure no extra spaces in the key

### "Inference timeout after 15s"
- Try again (may be service issue)
- Check NVIDIA status: https://status.nvidia.com/
- Verify Nemotron model access at https://build.nvidia.com/

### "Network error"
- Verify internet connection: `curl https://api.nvidia.com`
- Check corporate proxy/firewall blocks NVIDIA domains
- Ensure `https://integrate.api.nvidia.com` is reachable

### Test passes but main app fails
- Main app uses different timeout values
- Check [lib/ai/client.ts](../../lib/ai/client.ts) for retry logic
- Test only validates credential/model, not production inference settings

## Related Files

- **Test Endpoint**: [app/api/test-nvidia/credential-test/route.ts](../credential-test/route.ts)
- **Test Script**: [scripts/test-nvidia-credentials.ts](../../scripts/test-nvidia-credentials.ts)
- **Main AI Client**: [lib/ai/client.ts](../../lib/ai/client.ts) (includes retries, different timeout)
- **Health Check**: [app/api/ai/health/route.ts](../ai/health/route.ts) (alternative check)

## Next Steps

Once the test passes:

1. **Configure Production**: Set `NVIDIA_API_KEY` in production environment
2. **Test Main Endpoints**: Use `/api/ai/*` endpoints that depend on the key
3. **Monitor Usage**: Track token consumption at https://build.nvidia.com/
4. **Scale**: Plan for rate limiting and quota management

## Support

- NVIDIA Documentation: https://docs.nvidia.com/nim/
- API Reference: https://docs.nvidia.com/nim/nvidia-nim-deploy/tutorials/nvidia-api-endpoint.html
- Status Page: https://status.nvidia.com/
- Community: https://forums.developer.nvidia.com/
