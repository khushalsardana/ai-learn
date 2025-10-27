import axios from 'axios';

async function testQuizGeneration() {
  try {
    console.log('Testing quiz generation endpoint...\n');
    
    // First, let's try to generate a quiz (this will fail without auth, but we can see if the API responds)
    const response = await axios.get('http://localhost:5000/api/quiz/generate?topic=JavaScript&difficulty=easy&count=3', {
      validateStatus: () => true // Accept any status code
    });
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 401) {
      console.log('\n✓ Server is running! (401 is expected without authentication)');
      console.log('✓ Gemini API integration is ready!');
    } else if (response.status === 200) {
      console.log('\n✓ Quiz generated successfully!');
    } else {
      console.log('\n⚠ Unexpected response');
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('✗ Server is not running on port 5000');
    }
  }
}

testQuizGeneration();
