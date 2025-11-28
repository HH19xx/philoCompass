-- テストユーザーの作成
-- パスワードは全て "password123" のbcryptハッシュ
INSERT INTO "user" (username, email, password, created_by)
VALUES
  ('testuser1', 'test1@example.com', '$2a$10$97wTBcDL95VTLPRfQPCzfuEyGZ/UQbUSDqSbCj58skanIT1LN8Boi', 'system'),
  ('testuser2', 'test2@example.com', '$2a$10$97wTBcDL95VTLPRfQPCzfuEyGZ/UQbUSDqSbCj58skanIT1LN8Boi', 'system'),
  ('testuser3', 'test3@example.com', '$2a$10$97wTBcDL95VTLPRfQPCzfuEyGZ/UQbUSDqSbCj58skanIT1LN8Boi', 'system')
ON CONFLICT (username) DO NOTHING;
