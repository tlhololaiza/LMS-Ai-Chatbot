# Task 3.2: AIChatbot Component Integration - Testing Guide

## ✅ Implementation Complete

### Changes Made

1. **Import API Client**
   - Added `import { sendMessage, APIError } from '@/services/apiClient'`
   - Added `AlertCircle` icon for error display

2. **Replaced Mock `getBotResponse()` Function**
   - Converted from synchronous mock to async API call
   - Returns `Promise<{ content: string; sources: string[] }>`
   - Now calls real backend via `sendMessage()` API

3. **Convert Message History to API Format**
   - Transforms `ChatMessage[]` to API format with role + content
   - Maps `sender: 'user'` → `role: 'user'`
   - Maps `sender: 'bot'` → `role: 'assistant'`
   - Filters only user/bot messages (excludes system messages)

4. **Graceful Error Handling**
   - Catches `APIError` for typed API errors
   - Provides specific error messages for:
     - `429`: Rate limiting
     - `500`: Server errors
     - `400`: Bad requests
     - Network errors (fetch failures)
   - Fallback messages displayed in chat
   - Console logging for debugging

5. **Updated All Async Handlers**
   - `handleSend()` - Now async with try/catch
   - `explainText()` - Uses async IIFE pattern
   - `handleRegenerate()` - Now async with API calls

## 🧪 Testing Instructions

### Prerequisites

1. **Backend Server Must Be Running**
   ```bash
   cd server
   # Create .env if it doesn't exist
   cp .env.example .env
   # Add your Google Gemini API key to server/.env
   npm run dev
   ```

2. **Frontend Environment Configured**
   ```bash
   # Ensure .env exists in project root
   cat .env
   # Should contain: VITE_API_URL=http://localhost:4000
   ```

### Test 1: Simple Chat Message

1. Start the frontend: `npm run dev`
2. Open http://localhost:5173
3. Click the chatbot icon (bottom right)
4. Type a message: "What is React?"
5. Press Enter or click Send

**Expected Result:**
- ✅ User message appears immediately
- ✅ Typing indicator shows (bot is thinking...)
- ✅ Real AI response appears from Google Gemini
- ✅ Response is contextually relevant to question
- ✅ No mock/placeholder text

**Failure Cases:**
- ❌ Error message about connection → Check backend is running
- ❌ Mock response appears → API client not properly integrated
- ❌ Long delay with no response → Check backend logs

### Test 2: Conversation History

1. In the open chatbot, send: "What is React?"
2. Wait for response
3. Send follow-up: "Can you explain hooks?"
4. Check response references previous context

**Expected Result:**
- ✅ Second response builds on first conversation
- ✅ AI knows the context of "hooks" relates to React
- ✅ Conversation flows naturally

**Verify in Network Tab:**
- Request to `/api/chat` includes `conversationHistory` array
- History contains both user and assistant messages

### Test 3: Text Highlight Explanation

1. Navigate to any lesson with content
2. Highlight a technical term (e.g., "component")
3. Click "Explain" button
4. Chatbot opens with explanation request

**Expected Result:**
- ✅ Chatbot opens automatically
- ✅ User message shows: "Please explain: [text]"
- ✅ Real AI explanation appears
- ✅ Includes highlighted text context
- ✅ Source metadata visible

**Verify Metadata:**
- Check request includes `highlightedText`
- Includes `textContext` (surrounding text)
- Includes `source`, `lessonId`, `moduleId` if available

### Test 4: Error Handling - Server Offline

1. Stop the backend server (Ctrl+C in server terminal)
2. Try to send a message in chatbot
3. Observe error handling

**Expected Result:**
- ✅ Error message displays in chat
- ✅ Shows: "🔌 Unable to connect to the AI service..."
- ✅ No app crash
- ✅ Can continue using other features
- ✅ Error logged to console

### Test 5: Error Handling - Invalid Request

1. Backend running
2. Send empty message (just spaces)

**Expected Result:**
- ✅ Message is blocked (doesn't send)
- ✅ Input cleared or validation message shown

### Test 6: Regenerate Response

1. Send a message and get response
2. Click the regenerate button (🔄)
3. Observe new response generation

**Expected Result:**
- ✅ Typing indicator shows
- ✅ New API call made (check Network tab)
- ✅ Different/alternative response appears
- ✅ Conversation history included in request

### Test 7: Message History Conversion

**Manual Verification (Browser DevTools):**

1. Open DevTools → Network tab
2. Send message: "Hello"
3. Wait for response
4. Send another: "How are you?"
5. Inspect the second request payload

**Expected Request Structure:**
```json
{
  "message": "How are you?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "[AI response to Hello]"
    }
  ],
  "metadata": {}
}
```

**Verify:**
- ✅ `conversationHistory` is an array
- ✅ Each item has `role` ('user' or 'assistant')
- ✅ Each item has `content`
- ✅ Order is chronological
- ✅ Only user/bot messages included (no system messages)

### Test 8: Long Conversation

1. Have a conversation with 5+ exchanges
2. Check final request payload

**Expected Result:**
- ✅ All previous messages in history
- ✅ Oldest messages included (no truncation yet)
- ✅ Responses build on full context

**Performance Check:**
- Note: Long histories may slow responses
- Future enhancement: Implement history truncation (last 10 messages)

## 🐛 Debugging

### Console Logs

Check browser console for:
```
API Error: [error details]
```

### Network Tab

1. Filter by "chat" to see API calls
2. Check request payload matches expected format
3. Verify response structure:
   ```json
   {
     "response": "...",
     "timestamp": "...",
     "conversationId": "..."
   }
   ```

### Common Issues

**"Cannot find module '@/services/apiClient'"**
- Solution: Ensure `src/services/apiClient.ts` exists
- Run: `npm install` (dependencies might be missing)

**"API Error: Network Error"**
- Backend server not running
- CORS misconfiguration
- Wrong API_URL in .env

**"API Error: 401 Unauthorized"**
- Missing or invalid Gemini API key in `server/.env`
- Get key: https://makersuite.google.com/app/apikey

**Mock responses still appearing**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check file was saved correctly

## ✅ Success Criteria

- [x] API client imported into AIChatbot.tsx
- [x] Mock getBotResponse() replaced with real API call
- [x] Message history converted to role + content format
- [x] Error handling implemented with fallback messages
- [x] All handlers updated to async (handleSend, explainText, handleRegenerate)
- [x] TypeScript types maintained
- [ ] Backend server configured with API key (manual step)
- [ ] Tests passing with server running

## 📊 Test Results Template

Copy this and fill in your results:

```
=== TASK 3.2 TEST RESULTS ===

Date: [DATE]
Tester: [NAME]

Test 1: Simple Chat Message          [ PASS / FAIL ]
Test 2: Conversation History          [ PASS / FAIL ]
Test 3: Text Highlight Explanation    [ PASS / FAIL ]
Test 4: Error - Server Offline        [ PASS / FAIL ]
Test 5: Error - Invalid Request       [ PASS / FAIL ]
Test 6: Regenerate Response           [ PASS / FAIL ]
Test 7: Message History Format        [ PASS / FAIL ]
Test 8: Long Conversation             [ PASS / FAIL ]

Notes:
- [Any observations]
- [Issues encountered]
- [Performance notes]

Overall Status: [ ✅ READY / ⚠️ NEEDS WORK / ❌ BLOCKED ]
```

## 🚀 Next Steps

After testing passes:

1. **Optimize Performance**
   - Implement conversation history truncation
   - Add request debouncing
   - Cache responses for identical queries

2. **Enhanced Error UI**
   - Add retry button on errors
   - Show connection status indicator
   - Implement offline mode with queuing

3. **Streaming Responses**
   - Integrate `streamMessage()` for real-time typing
   - Show word-by-word response generation
   - Improve perceived performance

4. **Analytics**
   - Track API response times
   - Log error rates
   - Monitor conversation lengths

## 📝 Implementation Notes

### Code Changes Summary

**File:** `src/components/features/AIChatbot.tsx`

**Lines Changed:** ~150 lines modified

**Functions Updated:**
- `getBotResponse()` - Line ~245 (sync → async with API)
- `handleSend()` - Line ~267 (sync → async with try/catch)
- `explainText()` - Line ~186 (setTimeout → async IIFE)
- `handleRegenerate()` - Line ~318 (sync → async with API)

**New Imports:**
- `sendMessage` from '@/services/apiClient'
- `APIError` from '@/services/apiClient'
- `AlertCircle` icon from 'lucide-react'

**Error Messages:**
- Rate limiting (429): "⏳ I'm getting too many requests..."
- Server error (500): "⚠️ The AI service is temporarily unavailable..."
- Bad request (400): "❌ There was an issue with your request..."
- Network error: "🔌 Unable to connect to the AI service..."

### Type Safety

All async functions properly typed:
- `getBotResponse(): Promise<{ content: string; sources: string[] }>`
- `handleSend(): Promise<void>`
- `handleRegenerate(): Promise<void>`
- Maintains existing `ChatMessage` and `ChatMessageMetadata` types

### Backward Compatibility

- Existing UI components unchanged
- Message structure unchanged
- Context system still functional
- RAG citations still work (local enhancement)
