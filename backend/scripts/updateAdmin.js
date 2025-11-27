const { Client } = require('pg');

async function updateAdminPassword() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres:Kirill2002@localhost:5432/lgotniki',
  });

  const newHash =
    '$2a$10$jCiS0St0o5ov0oPsHE/MK.YM8Ay2oPtwEkDa9oJgojPOUfYC0jgQq';

  try {
    await client.connect();
    await client.query(
      "UPDATE users SET password_hash = $1 WHERE username = 'admin'",
      [newHash]
    );
    console.log('Admin password hash updated to admin123');
  } catch (error) {
    console.error('Failed to update admin password:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

updateAdminPassword();

