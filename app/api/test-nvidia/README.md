# Credential/Model Compatibility Test

This directory contains endpoints for testing NVIDIA API credential and model compatibility with bounded timeouts.

## Endpoints

### GET `/api/test-nvidia/credential-test`

**Purpose**: Verify NVIDIA_API_KEY credential validity and Nemotron model reachability with a 15-second bounded timeout.

**Response Format** (all responses return HTTP 200 with structured JSON):

#### Success Response
```json
{
  "success": true,
  "error": null,
  "message": "Credential and model compatibility verified",
  "model": "nvidia/nemotron-3-ultra-550b-a55b",
  "content": "OK",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 2,
    "total_tokens": 12
  },
  "timestamp": "2026-06-11T10:30:00.000Z",
  "durationMs": 2345
}
```

#### Authorization Failure (401/403)
```json
{
  "success": false,
  "error": "AUTHORIZATION_FAILED",
  "message": "Unauthorized: API key is invalid or expired",
  "httpStatus": 401,
  "apiErrorDetails": {...},
  "timestamp": "2026-06-11T10:30:00.000Z",
  "durationMs": 234
}
```

#### Inference Timeout (>15s)
```json
{
  "success": false,
  "error": "INFERENCE_TIMEOUT",
  "message": "Nemotron inference did not respond within 15000ms",
  "timeout": 15000,
  "timestamp": "2026-06-11T10:30:00.000Z",
  "durationMs": 15001
}
```

#### API Error (5xx, etc.)
```json
{
  "success": false,
  "error": "API_ERROR",
  "message": "NVIDIA API returned 503",
  "httpStatus": 503,
  "apiErrorDetails": {...},
  "timestamp": "2026-06-11T10:30:00.000Z",
  "durationMs": 1000
}
```

#### Missing API Key
```json
{
  "success": false,
  "error": "MISSING_API_KEY",
  "message": "NVIDIA_API_KEY environment variable is not set",
  "timestamp": "2026-06-11T10:30:00.000Z",
  "durationMs": 1
}
```

#### Network Error
```json
{
  "success": false,
  "error": "NETWORK_ERROR",
  "message": "fetch failed",
  "errorName": "TypeError",
  "timestamp": "2026-06-11T10:30:00.000Z",
  "durationMs": 500
}
```

## Error Types

| Error Code | HTTP Status | Meaning |
|---|---|---|
| `SUCCESS` | 200 (with success: true) | Credentials valid, model reachable |
| `MISSING_API_KEY` | 200 (HTTP 400) | NVIDIA_API_KEY not set |
| `AUTHORIZATION_FAILED` | 200 (HTTP 401/403) | API key invalid/expired or no permission |
| `INFERENCE_TIMEOUT` | 200 | Nemotron took >15s to respond |
| `API_ERROR` | 200 | NVIDIA API returned 5xx or other HTTP errors |
| `NETWORK_ERROR` | 200 | Network/connection issue |

## Usage

### Test in Browser
```
GET http://localhost:3000/api/test-nvidia/credential-test
```

### Test via cURL
```bash
curl http://localhost:3000/api/test-nvidia/credential-test
```

### Test via Node.js
```javascript
const response = await fetch('/api/test-nvidia/credential-test');
const result = await response.json();

if (result.success) {
  console.log('✓ Credentials and model verified');
  console.log(`  Model: ${result.model}`);
  console.log(`  Duration: ${result.durationMs}ms`);
} else {
  console.log('✗ Test failed:', result.error);
  console.log(`  Message: ${result.message}`);
}
```

## Bounded Timeout Behavior

The test uses a **15-second bounded timeout** via `AbortController`:

1. **0-15s**: Waiting for inference response
   - If response arrives before 15s: Return success or error
   - If no response by 15s: Abort and return `INFERENCE_TIMEOUT`

2. **Timeout is not retried**: Unlike the main `callNVIDIA()` function, this test endpoint does NOT retry on timeout
   - Single attempt per request
   - Timeout indicates service slowness or unavailability

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `NVIDIA_API_KEY` | (required) | Authorization bearer token |
| `NVIDIA_MODEL` | `nvidia/nemotron-3-ultra-550b-a55b` | Model ID to test |
| Bounded Timeout | 15000ms | Max wait time for inference |

## Debugging

Check these files:
- [credential-test/route.ts](./credential-test/route.ts) - Main test endpoint
- [../lib/ai/client.ts](../../../lib/ai/client.ts) - Retry logic (not used here)
- [../app/api/ai/health/route.ts](../../../app/api/ai/health/route.ts) - Alternative health check

## Notes

- Response always returns HTTP 200 for consistent error parsing
- `durationMs` includes all operations: setup, network, inference
- Actual error codes are in `error` field, not HTTP status
- No sensitive data (API key) is logged in responses
