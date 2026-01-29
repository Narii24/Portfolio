// Test Party Creation Endpoint
// Run this in browser console to debug party creation issues

console.log('=== PARTY ENDPOINT DEBUG ===');

async function testPartyEndpoint() {
  const apiUrl = 'http://localhost:8081/api';
  
  try {
    console.log('Testing POST to /parties endpoint...');
    
    const testPartyData = {
      partyId: 'P-TEST-123',
      caseId: 'C-TEST-123',
      fullName: 'TEST PARTY',
      phoneNumber: '1234567890',
      partyType: 'WITNESS'
    };
    
    console.log('Test party data:', testPartyData);
    
    const response = await fetch(`${apiUrl}/parties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(testPartyData)
    });
    
    console.log('Party creation response status:', response.status);
    console.log('Party creation response headers:', [...response.headers.entries()]);
    
    const responseText = await response.text();
    console.log('Party creation response body:', responseText);
    
    if (response.ok) {
      console.log('✅ Party endpoint works correctly');
    } else {
      console.log('❌ Party endpoint failed');
      console.log('Error details:', responseText);
    }
  } catch (error) {
    console.error('❌ Network error testing party endpoint:', error);
  }
}

async function testGetParties() {
  const apiUrl = 'http://localhost:8081/api';
  
  try {
    console.log('Testing GET from /parties endpoint...');
    
    const response = await fetch(`${apiUrl}/parties`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    
    console.log('GET parties response status:', response.status);
    
    if (response.ok) {
      const parties = await response.json();
      console.log('✅ GET parties successful');
      console.log('Existing parties:', parties);
    } else {
      console.log('❌ GET parties failed');
      console.log('Error:', await response.text());
    }
  } catch (error) {
    console.error('❌ Network error getting parties:', error);
  }
}

console.log('Run testPartyEndpoint() to test party creation');
console.log('Run testGetParties() to see existing parties');
console.log('Make sure your backend is running on localhost:8081');
