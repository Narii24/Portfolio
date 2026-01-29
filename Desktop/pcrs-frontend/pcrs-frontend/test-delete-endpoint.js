// Test DELETE endpoint directly
// Run this in browser console to test if the DELETE endpoint works

console.log('=== Testing DELETE Endpoint ===');

async function testDeleteEndpoint() {
  const caseId = 'C-020172'; // Change this to a real case ID
  const apiUrl = 'http://localhost:8081/api';
  
  try {
    console.log(`Testing DELETE: ${apiUrl}/cases/${caseId}`);
    
    const response = await fetch(`${apiUrl}/cases/${caseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (response.ok) {
      console.log('✅ DELETE request successful');
    } else {
      console.log('❌ DELETE request failed');
      console.log('Error details:', responseText);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Test if we can reach the backend at all
async function testBackendConnection() {
  try {
    const response = await fetch('http://localhost:8081/api/cases');
    console.log('Backend connection test status:', response.status);
    
    if (response.ok) {
      console.log('✅ Backend is reachable');
      const cases = await response.json();
      console.log('Available cases:', cases.length);
    } else {
      console.log('❌ Backend not responding correctly');
    }
  } catch (error) {
    console.error('❌ Cannot reach backend:', error);
  }
}

console.log('Run testBackendConnection() to test backend connectivity');
console.log('Run testDeleteEndpoint() to test DELETE endpoint');
console.log('Make sure your backend is running on localhost:8081');
