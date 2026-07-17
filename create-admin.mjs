import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const adminEmail = 'jason@jasonclark.online';
const adminPassword = 'StarCitizen1!';

async function createAdmin() {
  let connection;
  try {
    // Parse DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not set');
    }

    // Create connection
    connection = await mysql.createConnection(dbUrl);

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM admins WHERE email = ?',
      [adminEmail]
    );

    if (existing.length > 0) {
      console.log('✓ Admin user already exists');
      await connection.end();
      return;
    }

    // Insert admin user
    await connection.execute(
      'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
      [adminEmail, hashedPassword]
    );

    console.log('✓ Admin user created successfully!');
    console.log(`  Email: ${adminEmail}`);
    console.log('  Password: (securely hashed)');

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

createAdmin();
