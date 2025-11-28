-- Update default admin password hash to the required value
-- New password hash corresponds to the provided plaintext
UPDATE users
SET password_hash = '$2a$10$jCiS0St0o5ov0oPsHE/MK.YM8Ay2oPtwEkDa9oJgojPOUfYC0jgQq',
    updated_at = NOW()
WHERE username = 'admin';


