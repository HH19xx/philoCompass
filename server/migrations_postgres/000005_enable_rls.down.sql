-- RLS設定をロールバック

-- ポリシーを削除
DROP POLICY IF EXISTS "user_read_own" ON "user";
DROP POLICY IF EXISTS "user_update_own" ON "user";
DROP POLICY IF EXISTS "answers_read_own" ON answers;
DROP POLICY IF EXISTS "answers_insert_own" ON answers;
DROP POLICY IF EXISTS "answers_update_own" ON answers;
DROP POLICY IF EXISTS "philosophers_read_all" ON philosophers;

-- RLSを無効化
ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
ALTER TABLE answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE philosophers DISABLE ROW LEVEL SECURITY;
