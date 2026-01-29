// Quick Timeout Test for Case Registration
// Run this in browser console to test API responsiveness

console.log('=== TIMEOUT TEST ===');

async function testAPIResponseTime() {
  console.log('Testing API response times...');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:8081/api/cases', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ API responded in ${responseTime}ms`);
    console.log('Response status:', response.status);
    
    if (responseTime > 10000) {
      console.warn('⚠️ API is responding slowly (>10 seconds)');
      console.warn('This may cause timeouts in case registration');
    } else if (responseTime > 5000) {
      console.warn('⚠️ API is responding moderately slow (>5 seconds)');
    } else {
      console.log('✅ API response time is good');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.error('Check if backend is running on localhost:8081');
  }
}

async function testPartyEndpointTime() {
  console.log('Testing party endpoint response time...');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:8081/api/parties', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ Party API responded in ${responseTime}ms`);
    console.log('Response status:', response.status);
    
  } catch (error) {
    console.error('❌ Party API test failed:', error);
  }
}

async function testDocumentEndpointTime() {
  console.log('Testing document endpoint response time...');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:8081/api/documents', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''`
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ Document API responded in ${responseTime}ms`);
    console.log('Response status:', response.status);
    
  } catch (error) {
    console.error('❌ Document API test failed:', error);
  }
}

// Run all tests
console.log('🔍 Testing API response times...');
await testAPIResponseTime();
await testPartyEndpointTime();
await testDocumentEndpointTime();

console.log('=== TIMEOUT TEST COMPLETE ===');
console.log('📋 If APIs respond slowly, the timeout fix should help');
console.log('📋 Try registering a case now with better error handling');
