import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const email = 'admin@test.com';
const password = 'test1234';

// Hash the password
const passwordHash = await bcrypt.hash(password, 10);

console.log('Creating test admin:');
console.log('Email:', email);
console.log('Password:', password);
console.log('Hash:', passwordHash);

// Get database URL from environment
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse the database URL
const url = new URL(dbUrl);
const connection = await mysql.createConnection({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: {},
});

try {
  // Delete existing test admin if it exists
  await connection.execute('DELETE FROM admins WHERE email = ?', [email]);
  
  // Create new test admin
  await connection.execute(
    'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  console.log('Test admin created successfully');
  console.log('You can now login with:');
  console.log('Email:', email);
  console.log('Password:', password);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
} finally {
  await connection.end();
}
