/*
 test-env.js
 Checks if .env is loaded and prints masked URI
*/
require('dotenv').config();
console.log('cwd:', process.cwd());
console.log('PORT present:', process.env.PORT ? 'YES' : 'NO');
console.log('MONGODB_URI present:', process.env.MONGODB_URI ? 'YES' : 'NO');
if (process.env.MONGODB_URI) {
  const u = process.env.MONGODB_URI;
  const masked = u.replace(/:(.*?)@/, ':*****@');
  console.log('Masked MONGODB_URI:', masked.slice(0, 160) + (masked.length > 160 ? '...' : ''));
}
