// Case Registration Debugging Checklist
// Run this in browser console when registering a case with parties and file

console.log('=== CASE REGISTRATION DEBUG CHECKLIST ===');

// 1. Check if MinIO is enabled
function checkMinIOStatus() {
  const minioEnabled = localStorage.getItem('minio_presign_enabled');
  console.log('MinIO presign enabled:', minioEnabled);
  
  if (!minioEnabled || minioEnabled === 'false') {
    console.warn('⚠️ MinIO is DISABLED. Enable with:');
    console.warn('localStorage.setItem("minio_presign_enabled", "true");');
  }
  
  return minioEnabled === 'true';
}

// 2. Check API connectivity
async function checkAPIConnectivity() {
  try {
    const response = await fetch('http://localhost:8081/api/cases');
    console.log('API connectivity test status:', response.status);
    
    if (response.ok) {
      console.log('✅ Backend API is reachable');
    } else {
      console.log('❌ Backend API not responding correctly');
    }
  } catch (error) {
    console.error('❌ Cannot reach backend API:', error);
  }
}

// 3. Check authentication token
function checkAuthToken() {
  const token = localStorage.getItem('token');
  console.log('Auth token present:', !!token);
  console.log('Token length:', token ? token.length : 0);
  
  if (!token) {
    console.warn('⚠️ No authentication token found');
  }
  
  return token;
}

// 4. Test party endpoint directly
async function testPartyEndpoint() {
  try {
    const response = await fetch('http://localhost:8081/api/parties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({
        partyId: 'P-TEST-123',
        caseId: 'C-TEST-123',
        fullName: 'TEST PARTY',
        phoneNumber: '1234567890',
        partyType: 'WITNESS'
      })
    });
    
    console.log('Party endpoint test status:', response.status);
    const responseText = await response.text();
    console.log('Party endpoint test response:', responseText);
    
    if (response.ok) {
      console.log('✅ Party endpoint works correctly');
    } else {
      console.log('❌ Party endpoint failed');
    }
  } catch (error) {
    console.error('❌ Party endpoint test error:', error);
  }
}

// 5. Test MinIO connectivity
async function testMinIOConnectivity() {
  try {
    const response = await fetch('http://localhost:9001/minio/health/live');
    console.log('MinIO connectivity test status:', response.status);
    
    if (response.ok) {
      console.log('✅ MinIO is reachable');
    } else {
      console.log('❌ MinIO not responding correctly');
    }
  } catch (error) {
    console.error('❌ Cannot reach MinIO:', error);
  }
}

// Run all checks
console.log('🔍 Running comprehensive debugging checks...');
console.log('');
console.log('1. Checking MinIO status...');
checkMinIOStatus();

console.log('');
console.log('2. Checking API connectivity...');
await checkAPIConnectivity();

console.log('');
console.log('3. Checking authentication...');
checkAuthToken();

console.log('');
console.log('4. Testing party endpoint...');
await testPartyEndpoint();

console.log('');
console.log('5. Checking MinIO connectivity...');
await testMinIOConnectivity();

console.log('');
console.log('=== DEBUG CHECKLIST COMPLETE ===');
console.log('📋 Now try registering a case and check console logs');
console.log('📋 Look for:');
console.log('   - PARTY CREATION DEBUG section');
console.log('   - MinIO upload logs');
console.log('   - Any error messages');
console.log('   - Network request failures');
