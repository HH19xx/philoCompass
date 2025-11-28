-- user_idをNULL許可に変更（統計用の匿名データを許可）
ALTER TABLE answers ALTER COLUMN user_id DROP NOT NULL;

-- user_idがNULLの場合のインデックスも追加
CREATE INDEX idx_answers_anonymous ON answers (id) WHERE user_id IS NULL;
