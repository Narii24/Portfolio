// Debug Backend Connection Issues
// Run this in browser console to test backend connectivity

console.log('=== Backend Connection Debug ===');

// Test 1: Check if backend is reachable
async function testBackendConnection() {
  try {
    console.log('Testing basic connection to backend...');
    const response = await fetch('http://34.49.14.144:443/api/cases');
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      console.log('✅ Backend is reachable');
    } else {
      console.log('❌ Backend responded with error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
  }
}

// Test 2: Check CORS headers
async function testCORS() {
  try {
    const response = await fetch('http://34.49.14.144:443/api/cases', {
      method: 'GET',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('CORS test response status:', response.status);
    console.log('CORS headers:', response.headers.get('access-control-allow-origin'));
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
}

// Test 3: Test DELETE specifically
async function testDeleteEndpoint() {
  try {
    console.log('Testing DELETE endpoint...');
    const response = await fetch('http://34.49.14.144:443/api/cases/C-020172', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('DELETE test status:', response.status);
    console.log('DELETE test response:', await response.text());
  } catch (error) {
    console.log('❌ DELETE test failed:', error.message);
  }
}

console.log('Running connection tests...');
testBackendConnection();
testCORS();
testDeleteEndpoint();

console.log('\n=== Possible Solutions ===');
console.log('1. Check if backend server is running properly');
console.log('2. Verify CORS configuration on backend');
console.log('3. Check firewall settings');
console.log('4. Try accessing backend directly in browser: http://34.49.14.144:443/api/cases');
