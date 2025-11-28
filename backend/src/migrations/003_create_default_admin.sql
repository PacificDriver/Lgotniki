-- Create default admin user (password: admin123)
-- Password hash provided by infrastructure team
-- Generated hash: $2a$10$jCiS0St0o5ov0oPsHE/MK.YM8Ay2oPtwEkDa9oJgojPOUfYC0jgQq
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES (
  'admin',
  'admin@lgotniki.local',
  '$2a$10$jCiS0St0o5ov0oPsHE/MK.YM8Ay2oPtwEkDa9oJgojPOUfYC0jgQq',
  'Администратор системы',
  'admin',
  true
) ON CONFLICT (username) DO NOTHING;

-- Note: In production, change the default password immediately!
-- To generate a new password hash, use: 
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('your-password', 10).then(console.log);

