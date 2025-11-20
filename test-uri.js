/*
 test-uri.js
 Prints masked URI (safe)
*/
require('dotenv').config();
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.log('MONGODB_URI is MISSING');
  process.exit(0);
}
const masked = uri.replace(/:(.*?)@/, ':*****@');
console.log('Masked URI:', masked);
