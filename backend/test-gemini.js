// Test Gemini API Key
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API Key...');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

async function testAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    console.log('📡 Sending test request to Gemini API...');
    
    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    const text = response.text();

    console.log('✅ API Key is VALID!');
    console.log('Response:', text);
    console.log('\n🎉 Your Gemini API is working correctly!');
    
  } catch (error) {
    console.error('❌ API Key is INVALID or there\'s an error:');
    console.error('Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n📝 Your API key is invalid. Please:');
      console.log('1. Go to: https://aistudio.google.com/app/apikey');
      console.log('2. Create a new API key');
      console.log('3. Update GEMINI_API_KEY in backend/.env');
    } else if (error.message.includes('quota')) {
      console.log('\n⚠️  API quota exceeded. Wait a bit or create a new key.');
    } else {
      console.log('\n🔧 Check your internet connection and try again.');
    }
  }
}

testAPI();
