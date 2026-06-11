# Quick Start: NVIDIA Credential Test

## 🚀 In 2 Minutes

### 1. Get API Key
Visit https://build.nvidia.com/ → API Keys → Create New Key

### 2. Configure
Create `.env.local` in project root:
```env
NVIDIA_API_KEY=nvapi-your-actual-key-here
NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
```

### 3. Test
```bash
npm run dev          # Terminal 1: Start server
npm run test:nvidia  # Terminal 2: Run test
```

### 4. Expected Output (Success)
```
🔍 Testing NVIDIA Credential/Model Compatibility
📍 Endpoint: http://localhost:3000/api/test-nvidia/credential-test
⏱️  Bounded Timeout: 15s
────────────────────────────────────────────────────
✅ SUCCESS - Credentials and Model Compatible
   Model: nvidia/nemotron-3-ultra-550b-a55b
   Response: "OK"
   Usage: 10 prompt, 2 completion
   Duration: 2345ms
   Total (incl. network): 2350ms
────────────────────────────────────────────────────
✨ All tests passed!
```

## 📋 What Was Built

| File | Purpose |
|---|---|
| `app/api/test-nvidia/credential-test/route.ts` | Main test endpoint with 15s bounded timeout |
| `app/api/test-nvidia/README.md` | Endpoint documentation & response formats |
| `NVIDIA_CREDENTIAL_TEST.md` | Comprehensive setup & troubleshooting guide |
| `lib/nvidia-credential-test.ts` | TypeScript utilities for result interpretation |
| `scripts/test-nvidia-credentials.ts` | CLI test runner |
| `package.json` | Added `test:nvidia` script |

## 🎯 Key Features

✅ **Bounded Timeout**: 15 second abort timeout via `AbortController`  
✅ **Error Classification**: Distinguishes success, auth failure, timeout, API error, network error  
✅ **No Retries**: Single attempt to distinguish timeout from network issues  
✅ **TypeScript**: Fully typed endpoint and utilities  
✅ **CLI Tool**: Easy-to-use test runner with colored output  
✅ **Documentation**: Setup guide, troubleshooting, architecture diagrams  

## 🔍 Test Outcomes

The test returns `success: true` when:
- ✅ API key is valid and not expired
- ✅ NVIDIA API endpoint is reachable
- ✅ Nemotron model responds within 15 seconds
- ✅ Response is properly formatted

The test returns specific errors for:
- ❌ `MISSING_API_KEY` - NVIDIA_API_KEY not set in env
- ❌ `AUTHORIZATION_FAILED` - API key invalid (401/403)
- ❌ `INFERENCE_TIMEOUT` - No response after 15s
- ❌ `API_ERROR` - NVIDIA API 5xx error
- ❌ `NETWORK_ERROR` - Connection/DNS failure

## 📍 Access Points

```bash
# CLI (recommended)
npm run test:nvidia

# cURL
curl http://localhost:3000/api/test-nvidia/credential-test | jq

# Browser
http://localhost:3000/api/test-nvidia/credential-test

# Node.js
const res = await fetch('/api/test-nvidia/credential-test');
const result = await res.json();
```

## ⚡ Architecture

```
Bounded Timeout Test Flow:
┌─ NVIDIA_API_KEY configured?
│  └─ No: return MISSING_API_KEY
│
├─ Create 15s AbortController
│
├─ POST to NVIDIA (Nemotron inference)
│  ├─ Message: "Say 'OK' and nothing else."
│  └─ Max tokens: 10
│
└─ Response handling:
   ├─ HTTP 401/403: return AUTHORIZATION_FAILED
   ├─ HTTP 5xx: return API_ERROR
   ├─ Timeout: return INFERENCE_TIMEOUT
   ├─ Network error: return NETWORK_ERROR
   └─ HTTP 200 + valid response: return SUCCESS
```

## 🛠️ For Developers

### Use in Code
```typescript
import { 
  CredentialTestResult,
  interpretCredentialTestResult,
  formatCredentialTestResult 
} from '@/lib/nvidia-credential-test';

const res = await fetch('/api/test-nvidia/credential-test');
const result: CredentialTestResult = await res.json();

if (result.success) {
  console.log('Ready for AI features!');
} else {
  console.log(formatCredentialTestResult(result));
}
```

### Extend the Endpoint
See [app/api/test-nvidia/credential-test/route.ts](app/api/test-nvidia/credential-test/route.ts) for how to add:
- Custom timeout values
- Different model testing
- Batch testing
- Retry policies

## 📚 Related Docs

- [NVIDIA_CREDENTIAL_TEST.md](NVIDIA_CREDENTIAL_TEST.md) - Full setup guide
- [app/api/test-nvidia/README.md](app/api/test-nvidia/README.md) - API reference
- [lib/ai/client.ts](lib/ai/client.ts) - Main AI client (includes retry logic)

## 💡 Next Steps

1. ✅ Run the credential test to verify setup
2. ✅ Check that all AI endpoints work: `/api/ai/*`
3. ✅ Monitor token usage at https://build.nvidia.com/
4. ✅ Configure production NVIDIA_API_KEY
5. ✅ Set up alerting if credentials fail

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `MISSING_API_KEY` | Set NVIDIA_API_KEY in .env.local |
| `AUTHORIZATION_FAILED` | Check API key at https://build.nvidia.com/ |
| `INFERENCE_TIMEOUT` | Check https://status.nvidia.com/ and retry |
| Network error | Verify internet and firewall allow nvidia.com |

See [NVIDIA_CREDENTIAL_TEST.md](NVIDIA_CREDENTIAL_TEST.md) for detailed troubleshooting.
