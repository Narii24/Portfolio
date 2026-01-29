// Enable MinIO Presigned Uploads
// Run this in your browser console to enable MinIO uploads
localStorage.setItem('minio_presign_enabled', 'true');
console.log('MinIO presigned uploads enabled!');

// Check current status
console.log('MinIO presign status:', localStorage.getItem('minio_presign_enabled'));
