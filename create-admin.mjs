import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const email = 'jason@jasonclark.online';
const password = 'StarCitizen1!';

// Hash the password
const passwordHash = await bcrypt.hash(password, 10);

console.log('Email:', email);
console.log('Password Hash:', passwordHash);

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
  // Check if admin already exists
  const [existing] = await connection.execute(
    'SELECT id FROM admins WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    console.log('Admin already exists, updating password...');
    await connection.execute(
      'UPDATE admins SET password_hash = ? WHERE email = ?',
      [passwordHash, email]
    );
    console.log('Admin password updated successfully');
  } else {
    console.log('Creating new admin account...');
    await connection.execute(
      'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    console.log('Admin account created successfully');
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
} finally {
  await connection.end();
}
