-- Create default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt with salt rounds 10
-- Generated hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68cmJt7i6JqO6
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES (
  'admin',
  'admin@lgotniki.local',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68cmJt7i6JqO6',
  'Администратор системы',
  'admin',
  true
) ON CONFLICT (username) DO NOTHING;

-- Note: In production, change the default password immediately!
-- To generate a new password hash, use: 
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('your-password', 10).then(console.log);

