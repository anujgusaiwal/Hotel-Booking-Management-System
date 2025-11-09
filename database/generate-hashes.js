// Helper script to generate bcrypt hashes for seed data
// Run with: node database/generate-hashes.js

import bcrypt from 'bcryptjs';

const passwords = {
  admin: 'admin123',
  customer: 'customer123'
};

console.log('Generating bcrypt hashes...\n');

for (const [role, password] of Object.entries(passwords)) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`${role} password: ${password}`);
  console.log(`Hash: ${hash}\n`);
}

console.log('Copy these hashes to your seed.sql file.');

