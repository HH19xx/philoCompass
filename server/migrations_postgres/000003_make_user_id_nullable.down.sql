-- user_idをNOT NULLに戻す（ロールバック時）
-- 注意: user_idがNULLのレコードが存在する場合は失敗する
ALTER TABLE answers ALTER COLUMN user_id SET NOT NULL;

-- 匿名データ用のインデックスを削除
DROP INDEX IF EXISTS idx_answers_anonymous;
