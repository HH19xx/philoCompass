-- Row Level Security (RLS) を全テーブルに有効化
-- セキュリティベストプラクティスとして、PostgREST公開テーブルにRLSを適用

-- userテーブルのRLS有効化
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- answersテーブルのRLS有効化
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- philosophersテーブルのRLS有効化
ALTER TABLE philosophers ENABLE ROW LEVEL SECURITY;

-- userテーブルのポリシー設定
-- 読み取り: 自分自身のレコードのみ閲覧可能
CREATE POLICY "user_read_own" ON "user"
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- 更新: 自分自身のレコードのみ更新可能
CREATE POLICY "user_update_own" ON "user"
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- answersテーブルのポリシー設定
-- 読み取り: 自分の回答のみ閲覧可能
CREATE POLICY "answers_read_own" ON answers
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- 挿入: 認証済みユーザーのみ自分の回答を挿入可能
CREATE POLICY "answers_insert_own" ON answers
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

-- 更新: 自分の回答のみ更新可能
CREATE POLICY "answers_update_own" ON answers
    FOR UPDATE
    USING (auth.uid()::text = user_id::text);

-- philosophersテーブルのポリシー設定
-- 読み取り: 全員が閲覧可能（哲学者データは公開情報）
CREATE POLICY "philosophers_read_all" ON philosophers
    FOR SELECT
    USING (true);

-- 書き込み: 管理者のみ（サービスロールキーを使用したバックエンド経由のみ）
-- この制約により、フロントエンドから直接書き込むことは不可能
