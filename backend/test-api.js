import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testAPI() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Found' : 'Missing');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Test with gemini-2.5-flash
    console.log('\nTesting model: gemini-2.5-flash');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    const text = response.text();
    
    console.log('✓ Success! Response:', text);
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

testAPI();
