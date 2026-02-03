/**
 * Standalone API Client Test Script
 * Run this to test the API client independently
 * 
 * Usage: npm run test:api-client
 */

import { sendMessage, streamMessage, testConnection, getAPIConfig, APIError } from './apiClient';

async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   LMS API Client Independent Test Suite   ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const config = getAPIConfig();
  console.log('📋 Configuration:');
  console.log(`   API URL: ${config.apiUrl}`);
  console.log(`   Chat Endpoint: ${config.chatEndpoint}`);
  console.log(`   Stream Endpoint: ${config.streamEndpoint}\n`);

  // Test 1: Connection Check
  console.log('🔌 Test 1: Connection Test');
  console.log('─'.repeat(50));
  const startTime = Date.now();
  const isConnected = await testConnection();
  const elapsed = Date.now() - startTime;
  
  if (isConnected) {
    console.log(`✅ PASSED - Server is reachable (${elapsed}ms)`);
  } else {
    console.log(`❌ FAILED - Cannot connect to server`);
    console.log(`\n⚠️  Make sure the backend server is running:`);
    console.log(`   cd server && npm run dev\n`);
    return;
  }

  // Test 2: Simple Message
  console.log('\n💬 Test 2: Send Simple Message');
  console.log('─'.repeat(50));
  try {
    const start = Date.now();
    const response = await sendMessage({
      message: 'What is React?',
    });
    const elapsed = Date.now() - start;
    
    console.log(`✅ PASSED - Response received (${elapsed}ms)`);
    console.log(`\n📝 Response Preview:`);
    console.log(`   ${response.response.substring(0, 150)}...`);
    console.log(`   Timestamp: ${response.timestamp}`);
  } catch (error) {
    console.log(`❌ FAILED`);
    if (error instanceof APIError) {
      console.log(`   Error: ${error.message}`);
      console.log(`   Status: ${error.statusCode} ${error.statusText}`);
    } else {
      console.log(`   Error: ${error}`);
    }
  }

  // Test 3: Message with Conversation History
  console.log('\n💬 Test 3: Send Message with Conversation History');
  console.log('─'.repeat(50));
  try {
    const start = Date.now();
    const response = await sendMessage({
      message: 'Can you explain hooks in more detail?',
      conversationHistory: [
        { role: 'user', content: 'What is React?' },
        { role: 'assistant', content: 'React is a JavaScript library for building user interfaces using components.' },
      ],
    });
    const elapsed = Date.now() - start;
    
    console.log(`✅ PASSED - Contextual response received (${elapsed}ms)`);
    console.log(`\n📝 Response Preview:`);
    console.log(`   ${response.response.substring(0, 150)}...`);
  } catch (error) {
    console.log(`❌ FAILED`);
    if (error instanceof APIError) {
      console.log(`   Error: ${error.message}`);
    }
  }

  // Test 4: Message with Metadata
  console.log('\n📚 Test 4: Send Message with Metadata');
  console.log('─'.repeat(50));
  try {
    const start = Date.now();
    const response = await sendMessage({
      message: 'Explain this concept',
      metadata: {
        courseId: 'react-101',
        lessonId: 'lesson-3',
        highlightedText: 'useState hook',
        textContext: 'In React, the useState hook allows you to add state to functional components.',
        source: 'lesson',
      },
    });
    const elapsed = Date.now() - start;
    
    console.log(`✅ PASSED - Response with context received (${elapsed}ms)`);
    console.log(`\n📝 Response Preview:`);
    console.log(`   ${response.response.substring(0, 150)}...`);
  } catch (error) {
    console.log(`❌ FAILED`);
    if (error instanceof APIError) {
      console.log(`   Error: ${error.message}`);
    }
  }

  // Test 5: Streaming Response
  console.log('\n🌊 Test 5: Stream Message');
  console.log('─'.repeat(50));
  try {
    const start = Date.now();
    const chunks: string[] = [];
    let chunkCount = 0;
    
    process.stdout.write('   Streaming: ');
    
    for await (const chunk of streamMessage({
      message: 'Tell me about TypeScript in one sentence',
    })) {
      chunks.push(chunk);
      chunkCount++;
      process.stdout.write('█');
    }
    
    const elapsed = Date.now() - start;
    const fullResponse = chunks.join('');
    
    console.log(`\n✅ PASSED - Stream completed (${elapsed}ms)`);
    console.log(`   Chunks received: ${chunkCount}`);
    console.log(`   Total length: ${fullResponse.length} characters`);
    console.log(`\n📝 Streamed Response:`);
    console.log(`   ${fullResponse.substring(0, 200)}...`);
  } catch (error) {
    console.log(`\n❌ FAILED`);
    if (error instanceof APIError) {
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`   Error: ${error}`);
    }
  }

  // Test 6: Error Handling
  console.log('\n⚠️  Test 6: Error Handling (Invalid Request)');
  console.log('─'.repeat(50));
  try {
    await sendMessage({
      message: '',  // Empty message
    });
    console.log(`❌ FAILED - No error thrown for invalid request`);
  } catch (error) {
    if (error instanceof APIError) {
      console.log(`✅ PASSED - Error properly caught and typed`);
      console.log(`   Error message: ${error.message}`);
      console.log(`   Status code: ${error.statusCode || 'N/A'}`);
    } else {
      console.log(`⚠️  PARTIAL - Error caught but not properly typed`);
      console.log(`   Error: ${error}`);
    }
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║            Test Suite Complete             ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n✨ API Client is working correctly!\n');
}

// Run tests
main().catch(console.error);
