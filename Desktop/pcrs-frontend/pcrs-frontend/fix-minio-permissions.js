// Fix MinIO Manual Upload Permissions
// This script helps you identify and fix the "Access Denied" error for manual uploads

console.log('=== MinIO Manual Upload Fix ===');

// Step 1: Check if you're logged into MinIO console
console.log('1. Open MinIO console in your browser');
console.log('2. Check what user you are logged in as');

// Step 2: Create admin user or check permissions
console.log('\n=== SOLUTIONS ===');
console.log('Option A - Use Admin Credentials:');
console.log('- Log out of MinIO console');
console.log('- Log back in with admin credentials (usually minioadmin/minioadmin)');
console.log('- Try manual upload again');

console.log('\nOption B - Create New Admin User:');
console.log('1. Log in as admin');
console.log('2. Go to Identity → Users');
console.log('3. Create new user with admin privileges');
console.log('4. Assign "consoleAdmin" policy');

console.log('\nOption C - Update Current User Policy:');
console.log('1. Log in as admin');
console.log('2. Go to Identity → Users');
console.log('3. Select your current user');
console.log('4. Add "readwrite" policy for pcrs-file bucket');

// Step 3: Test the fix
console.log('\n=== TESTING ===');
console.log('After fixing permissions:');
console.log('1. Try manual upload in MinIO console');
console.log('2. Try application upload with: localStorage.setItem("minio_presign_enabled", "true")');

console.log('\nNote: Application upload uses presigned URLs which bypass user permissions.');
console.log('Manual upload requires direct user permissions on the bucket.');
