// Test MinIO Connection and Bucket Access
// Run this in browser console to verify MinIO setup

console.log('=== MinIO Connection Test ===');

// Test 1: Check if MinIO server is running
async function testMinIOConnection() {
  try {
    const response = await fetch('http://localhost:9000/minio/health/live');
    if (response.ok) {
      console.log('✅ MinIO server is running');
    } else {
      console.log('❌ MinIO server health check failed');
    }
  } catch (error) {
    console.log('❌ Cannot connect to MinIO server:', error.message);
    console.log('💡 Make sure MinIO is running on http://localhost:9000');
  }
}

// Test 2: Check bucket access
async function testBucketAccess() {
  try {
    // This will test if we can access the MinIO console
    const response = await fetch('http://localhost:9000/');
    if (response.ok) {
      console.log('✅ MinIO console accessible');
      console.log('🔑 Try logging in with: minioadmin / minioadmin');
    } else {
      console.log('❌ MinIO console not accessible');
    }
  } catch (error) {
    console.log('❌ Cannot access MinIO console:', error.message);
  }
}

// Test 3: Manual file upload test
console.log('\n=== Manual Upload Test ===');
console.log('1. Open http://localhost:9000 in browser');
console.log('2. Login with minioadmin/minioadmin');
console.log('3. Click on "pcrs-file" bucket');
console.log('4. Try uploading a small test file manually');
console.log('5. If manual upload fails, the issue is MinIO permissions');
console.log('6. If manual upload works, the issue is in our code');

// Run tests
testMinIOConnection();
testBucketAccess();

console.log('\n=== Common Issues ===');
console.log('• Wrong MinIO credentials');
console.log('• Bucket permissions not set');
console.log('• MinIO server not running');
console.log('• Firewall blocking port 9000');
console.log('• CORS issues (less likely for console access)');
