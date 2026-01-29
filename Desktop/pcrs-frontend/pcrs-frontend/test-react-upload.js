// Test the exact same process as React app
const testReactUpload = async () => {
  try {
    console.log('🧪 Testing React upload process...');
    
    // Step 1: Get presigned URL (same as React app)
    const presignResponse = await fetch('http://localhost:8081/api/storage/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId: 'C-310030', // Same case ID from your logs
        fileName: 'PRO Rata Calculation.pdf', // Same filename from your logs
        contentType: 'application/pdf'
      })
    });
    
    if (!presignResponse.ok) {
      throw new Error(`Presign failed: ${presignResponse.status}`);
    }
    
    const presign = await presignResponse.json();
    console.log('✅ Presign response:', presign);
    
    // Step 2: Upload file (same as React app)
    const testFileContent = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 51]); // Simple PDF header
    const uploadResponse = await fetch(presign.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/pdf'
      },
      body: testFileContent
    });
    
    console.log('📤 Upload response status:', uploadResponse.status);
    console.log('📤 Upload response headers:', [...uploadResponse.headers.entries()]);
    
    if (uploadResponse.ok) {
      console.log('✅ React-style upload successful!');
      console.log('📁 Check MinIO at:', presign.key);
      console.log('🔗 MinIO Console: http://localhost:9000');
      console.log('📂 Path: pcrs-file/' + presign.key);
    } else {
      console.error('❌ Upload failed:', await uploadResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testReactUpload();
