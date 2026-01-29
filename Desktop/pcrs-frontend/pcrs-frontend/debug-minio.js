// Debug MinIO Upload Issues
// Run this in browser console to check MinIO configuration

console.log('=== MinIO Debug Information ===');

// Check if presign is enabled
const presignEnabled = localStorage.getItem('minio_presign_enabled');
console.log('MinIO presign enabled:', presignEnabled);

// Check API base URL
console.log('Current API base URL:', window.location.origin);

// Test the presign endpoint directly
async function testPresignEndpoint() {
  try {
    const response = await fetch('/api/storage/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId: 'TEST-123',
        fileName: 'test-file.pdf',
        contentType: 'application/pdf'
      })
    });
    
    console.log('Presign endpoint test response:', response);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Presign response data:', data);
    } else {
      console.error('Presign endpoint failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error testing presign endpoint:', error);
  }
}

// Enable MinIO if not already enabled
if (!presignEnabled) {
  localStorage.setItem('minio_presign_enabled', 'true');
  console.log('MinIO presign uploads enabled!');
}

console.log('Run testPresignEndpoint() to test the API endpoint');
