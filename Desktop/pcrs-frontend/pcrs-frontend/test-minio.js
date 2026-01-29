// Test MinIO upload directly
const testMinIOUpload = async () => {
  try {
    // Get presigned URL
    const presignResponse = await fetch('http://localhost:8081/api/storage/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId: 'test-direct',
        fileName: 'test-upload.txt',
        contentType: 'text/plain'
      })
    });
    
    const presign = await presignResponse.json();
    console.log('Presign response:', presign);
    
    // Upload file
    const testContent = 'This is a test file uploaded directly to MinIO';
    const uploadResponse = await fetch(presign.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: testContent
    });
    
    console.log('Upload response status:', uploadResponse.status);
    console.log('Upload response:', uploadResponse);
    
    if (uploadResponse.ok) {
      console.log('✅ Direct MinIO upload successful!');
      console.log('Check MinIO console at: http://localhost:9000');
      console.log('Look in bucket: pcrs-file');
      console.log('Path: cases/test-direct/');
    } else {
      console.error('❌ Upload failed:', await uploadResponse.text());
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testMinIOUpload();
