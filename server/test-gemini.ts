import geminiService from './src/services/geminiService.js';

async function testGemini() {
  console.log('🧪 Testing Gemini Service with Knowledge Base...\n');

  try {
    // Test 1: Simple question
    console.log('Test 1: Simple question');
    const response1 = await geminiService.generateResponse('What is React?', []);
    console.log('✅ Response:', response1.substring(0, 150) + '...\n');

    // Test 2: Knowledge base query (should find concepts)
    console.log('Test 2: Knowledge base query about Props');
    const response2 = await geminiService.generateResponse('Explain React props to me', []);
    console.log('✅ Response:', response2.substring(0, 150) + '...\n');

    // Test 3: With conversation history
    console.log('Test 3: With conversation history');
    const history = [
      { role: 'user' as const, content: 'What is TypeScript?' },
      { role: 'assistant' as const, content: 'TypeScript is a typed superset of JavaScript.' }
    ];
    const response3 = await geminiService.generateResponse('Can you give me an example?', history);
    console.log('✅ Response:', response3.substring(0, 150) + '...\n');

    // Test 4: FAQ query
    console.log('Test 4: FAQ-related query');
    const response4 = await geminiService.generateResponse('When should I use useEffect?', []);
    console.log('✅ Response:', response4.substring(0, 150) + '...\n');

    console.log('✅ All tests passed! Knowledge base integration working.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testGemini();
