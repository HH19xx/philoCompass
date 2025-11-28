-- SQLiteではALTER COLUMN構文が使えないため、テーブル再作成で対応
-- 一時テーブルを作成してデータを移行し、user_idをNULL許可にする

-- 1. 新しいスキーマで一時テーブル作成
CREATE TABLE answers_new (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    answer_01       INTEGER NOT NULL CHECK (answer_01 BETWEEN -2 AND 2),
    answer_02       INTEGER NOT NULL CHECK (answer_02 BETWEEN -2 AND 2),
    answer_03       INTEGER NOT NULL CHECK (answer_03 BETWEEN -2 AND 2),
    answer_04       INTEGER NOT NULL CHECK (answer_04 BETWEEN -2 AND 2),
    answer_05       INTEGER NOT NULL CHECK (answer_05 BETWEEN -2 AND 2),
    answer_06       INTEGER NOT NULL CHECK (answer_06 BETWEEN -2 AND 2),
    answer_07       INTEGER NOT NULL CHECK (answer_07 BETWEEN -2 AND 2),
    answer_08       INTEGER NOT NULL CHECK (answer_08 BETWEEN -2 AND 2),
    answer_09       INTEGER NOT NULL CHECK (answer_09 BETWEEN -2 AND 2),
    answer_10       INTEGER NOT NULL CHECK (answer_10 BETWEEN -2 AND 2),
    answer_11       INTEGER NOT NULL CHECK (answer_11 BETWEEN -2 AND 2),
    answer_12       INTEGER NOT NULL CHECK (answer_12 BETWEEN -2 AND 2),
    answer_13       INTEGER NOT NULL CHECK (answer_13 BETWEEN -2 AND 2),
    answer_14       INTEGER NOT NULL CHECK (answer_14 BETWEEN -2 AND 2),
    answer_15       INTEGER NOT NULL CHECK (answer_15 BETWEEN -2 AND 2),
    answer_16       INTEGER NOT NULL CHECK (answer_16 BETWEEN -2 AND 2),
    created_at      DATETIME NOT NULL DEFAULT (DATETIME('now')),
    updated_at      DATETIME
);

-- 2. 既存データを新テーブルにコピー
INSERT INTO answers_new SELECT * FROM answers;

-- 3. 旧テーブル削除
DROP TABLE answers;

-- 4. 新テーブルをリネーム
ALTER TABLE answers_new RENAME TO answers;

-- 5. インデックス再作成
CREATE INDEX idx_answers_user_id ON answers (user_id);
CREATE INDEX idx_answers_user_created ON answers (user_id, created_at DESC);
CREATE INDEX idx_answers_anonymous ON answers (id) WHERE user_id IS NULL;
