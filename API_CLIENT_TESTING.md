# API Client Testing Guide

This guide explains how to test the API client independently.

## Prerequisites

1. **Backend Server Must Be Running**
   - The API client communicates with the backend server at `http://localhost:4000`
   - Server must have `/api/chat` and `/api/chat/stream` endpoints

2. **Environment Variables**
   - Frontend `.env` file must have `VITE_API_URL=http://localhost:4000`
   - Backend `server/.env` file must have valid `GOOGLE_GEMINI_API_KEY`

## Setup Instructions

### 1. Configure Backend

```bash
cd server

# Create .env file from example
cp .env.example .env

# Edit .env and add your Google Gemini API key
# Get one free at: https://makersuite.google.com/app/apikey
```

Edit `server/.env`:
```env
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
PORT=4000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies (if not already done)
cd ..
npm install
```

### 3. Start Backend Server

```bash
cd server
npm run dev
```

You should see:
```
Server running on http://localhost:4000
Chat API: http://localhost:4000/api/chat
Stream API: http://localhost:4000/api/chat/stream
```

## Running Tests

### Option 1: Unit Tests (Mocked)

Run the vitest unit tests (doesn't require server):

```bash
npm test -- src/services/apiClient.test.ts
```

### Option 2: Integration Tests (Live Server Required)

Run the standalone test script that makes actual API calls:

```bash
# Make sure server is running first!
npm run test:api-client
```

This will test:
- ✅ Connection to server
- ✅ Simple message sending
- ✅ Message with conversation history
- ✅ Message with metadata (highlighted text, lesson context)
- ✅ Streaming responses
- ✅ Error handling

### Option 3: Manual Testing

You can also import and use the API client directly in your code:

```typescript
import { sendMessage, streamMessage, testConnection } from '@/services/apiClient';

// Test connection
const isConnected = await testConnection();
console.log('Server reachable:', isConnected);

// Send a simple message
const response = await sendMessage({
  message: 'What is React?'
});
console.log(response.response);

// Stream a response
for await (const chunk of streamMessage({
  message: 'Explain TypeScript'
})) {
  process.stdout.write(chunk);
}
```

## API Client Features

### ✨ Core Functions

#### `sendMessage(request: ChatRequest): Promise<ChatResponse>`
Sends a message and waits for complete response.

```typescript
const response = await sendMessage({
  message: 'What is React?',
  conversationHistory: [
    { role: 'user', content: 'Previous question' },
    { role: 'assistant', content: 'Previous answer' }
  ],
  metadata: {
    courseId: 'react-101',
    lessonId: 'lesson-3',
    highlightedText: 'useState',
    source: 'lesson'
  }
});
```

#### `streamMessage(request: ChatRequest): AsyncGenerator<string>`
Streams the response in chunks as it's generated.

```typescript
const chunks: string[] = [];
for await (const chunk of streamMessage({ message: 'Explain hooks' })) {
  chunks.push(chunk);
  console.log(chunk); // Display each chunk as it arrives
}
const fullResponse = chunks.join('');
```

#### `testConnection(): Promise<boolean>`
Tests if the backend server is reachable.

```typescript
if (await testConnection()) {
  console.log('✅ Server is online');
} else {
  console.log('❌ Server is offline');
}
```

### 🛡️ Error Handling

All functions throw `APIError` on failure:

```typescript
try {
  const response = await sendMessage({ message: 'Hello' });
} catch (error) {
  if (error instanceof APIError) {
    console.log('Status:', error.statusCode);
    console.log('Message:', error.message);
  }
}
```

### 📝 Helper Functions

```typescript
// Send with ChatMessage history
import { sendMessageWithHistory } from '@/services/apiClient';

const response = await sendMessageWithHistory(
  'New question',
  chatMessages, // Array of ChatMessage objects
  { courseId: 'react-101' }
);

// Stream with ChatMessage history  
for await (const chunk of streamMessageWithHistory(
  'New question',
  chatMessages,
  { lessonId: 'lesson-5' }
)) {
  console.log(chunk);
}
```

## Troubleshooting

### Server Not Reachable

```
❌ FAILED - Cannot connect to server
```

**Solutions:**
1. Make sure backend server is running: `cd server && npm run dev`
2. Check server is on port 4000: `http://localhost:4000/api/health`
3. Verify `.env` has correct `VITE_API_URL=http://localhost:4000`

### API Key Errors

```
Error: API request failed: 401 Unauthorized
```

**Solutions:**
1. Check `server/.env` has valid `GOOGLE_GEMINI_API_KEY`
2. Get a free API key at https://makersuite.google.com/app/apikey
3. Restart the server after adding the key

### CORS Errors

```
Access to fetch blocked by CORS policy
```

**Solutions:**
1. Ensure server has CORS enabled (should be by default)
2. Check frontend is making requests to correct URL
3. Verify both run on localhost (not mixing localhost and 127.0.0.1)

### Rate Limiting

```
Too many requests. Please wait a moment and try again.
```

**Solutions:**
1. Wait 60 seconds before trying again
2. Gemini API has rate limits on free tier
3. Consider upgrading API key or implementing request queuing

## File Structure

```
src/services/
├── apiClient.ts           # Main API client implementation
├── apiClient.test.ts      # Vitest unit tests
└── testApiClient.ts       # Standalone integration test script

.env                       # Frontend environment variables
server/.env               # Backend environment variables
```

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000
```

### Backend (`server/.env`)
```env
GOOGLE_GEMINI_API_KEY=your_key_here
PORT=4000
NODE_ENV=development
```

## Next Steps

Once testing is complete:

1. ✅ API client is working correctly
2. ✅ Integrate into AIChatbot component
3. ✅ Replace mock responses with real API calls
4. ✅ Add loading states and error UI
5. ✅ Test text-to-explanation feature with real AI
6. ✅ Deploy to production

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify all prerequisites are met
3. Check console logs for detailed error messages
4. Ensure all dependencies are installed
5. Try restarting both frontend and backend servers
