// Backend Connectivity Test
// Run this in browser console to diagnose connection issues

console.log('=== BACKEND CONNECTIVITY TEST ===');

async function testBackendConnection() {
  console.log('🔍 Testing backend connectivity...');
  
  const testUrls = [
    'http://localhost:8081/api/cases',
    'http://localhost:8081/api/parties', 
    'http://localhost:8081/api/documents'
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`✅ ${url} - Status: ${response.status}, Time: ${responseTime}ms`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   Data: ${Array.isArray(data) ? data.length + ' items' : typeof data}`);
      }
      
    } catch (error) {
      console.error(`❌ ${url} - Error:`, error.message);
      
      if (error.message.includes('Failed to fetch')) {
        console.error('   💡 Backend is not running or not accessible');
        console.error('   💡 Check if backend server is running on port 8081');
      } else if (error.message.includes('timeout')) {
        console.error('   💡 Backend is responding too slowly');
        console.error('   💡 Check backend performance or increase timeout');
      }
    }
  }
}

function checkBackendRequirements() {
  console.log('🔍 Checking backend requirements...');
  
  // Check if we can reach the backend port
  fetch('http://localhost:8081/health', { method: 'GET' })
    .then(response => {
      console.log('✅ Backend health check:', response.status);
    })
    .catch(() => {
      console.warn('⚠️ Backend health endpoint not available');
    });
  
  // Check authentication
  const token = localStorage.getItem('token');
  console.log('🔑 Authentication token present:', !!token);
  
  if (!token) {
    console.warn('⚠️ No authentication token - login required');
  }
}

function suggestSolutions() {
  console.log('💡 SUGGESTED SOLUTIONS:');
  console.log('');
  console.log('1. Start Backend Server:');
  console.log('   cd backend-directory');
  console.log('   npm start or java -jar backend.jar');
  console.log('');
  console.log('2. Check Port Availability:');
  console.log('   netstat -an | grep 8081');
  console.log('   lsof -i :8081');
  console.log('');
  console.log('3. Verify Backend Configuration:');
  console.log('   Backend should listen on http://localhost:8081');
  console.log('   CORS should allow http://localhost:3000');
  console.log('');
  console.log('4. Check Firewall/Antivirus:');
  console.log('   Temporarily disable to test');
  console.log('   Add exception for port 8081');
  console.log('');
  console.log('5. Test with curl:');
  console.log('   curl -v http://localhost:8081/api/cases');
}

// Run all tests
console.log('🚀 Starting comprehensive backend test...');
await testBackendConnection();
checkBackendRequirements();
suggestSolutions();

console.log('=== CONNECTIVITY TEST COMPLETE ===');
console.log('📋 If backend is not responding, start it first before case registration');
