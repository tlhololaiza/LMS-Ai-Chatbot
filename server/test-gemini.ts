import geminiService from './src/services/geminiService.js';

async function testGemini() {
  console.log('🧪 Testing Gemini Service...\n');

  try {
    // Test 1: Simple question
    console.log('Test 1: Simple question');
    const response1 = await geminiService.generateResponse('What is React?', []);
    console.log('✅ Response:', response1.substring(0, 100) + '...\n');

    // Test 2: With conversation history
    console.log('Test 2: With conversation history');
    const history = [
      { role: 'user' as const, content: 'What is TypeScript?' },
      { role: 'assistant' as const, content: 'TypeScript is a typed superset of JavaScript.' }
    ];
    const response2 = await geminiService.generateResponse('Can you explain more?', history);
    console.log('✅ Response:', response2.substring(0, 100) + '...\n');

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testGemini();
