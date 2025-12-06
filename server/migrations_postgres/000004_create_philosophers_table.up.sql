-- philosophersテーブルを作成
-- 歴史上の哲学者の回答データを保存するテーブル
CREATE TABLE IF NOT EXISTS philosophers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,           -- 哲学者名（例: "カント", "ニーチェ"）
    era VARCHAR(50),                      -- 時代（例: "18世紀", "19世紀"）
    description TEXT,                     -- 哲学者の簡単な説明
    answer_01 SMALLINT NOT NULL CHECK (answer_01 BETWEEN -2 AND 2),
    answer_02 SMALLINT NOT NULL CHECK (answer_02 BETWEEN -2 AND 2),
    answer_03 SMALLINT NOT NULL CHECK (answer_03 BETWEEN -2 AND 2),
    answer_04 SMALLINT NOT NULL CHECK (answer_04 BETWEEN -2 AND 2),
    answer_05 SMALLINT NOT NULL CHECK (answer_05 BETWEEN -2 AND 2),
    answer_06 SMALLINT NOT NULL CHECK (answer_06 BETWEEN -2 AND 2),
    answer_07 SMALLINT NOT NULL CHECK (answer_07 BETWEEN -2 AND 2),
    answer_08 SMALLINT NOT NULL CHECK (answer_08 BETWEEN -2 AND 2),
    answer_09 SMALLINT NOT NULL CHECK (answer_09 BETWEEN -2 AND 2),
    answer_10 SMALLINT NOT NULL CHECK (answer_10 BETWEEN -2 AND 2),
    answer_11 SMALLINT NOT NULL CHECK (answer_11 BETWEEN -2 AND 2),
    answer_12 SMALLINT NOT NULL CHECK (answer_12 BETWEEN -2 AND 2),
    answer_13 SMALLINT NOT NULL CHECK (answer_13 BETWEEN -2 AND 2),
    answer_14 SMALLINT NOT NULL CHECK (answer_14 BETWEEN -2 AND 2),
    answer_15 SMALLINT NOT NULL CHECK (answer_15 BETWEEN -2 AND 2),
    answer_16 SMALLINT NOT NULL CHECK (answer_16 BETWEEN -2 AND 2),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50)
);

-- 哲学者名にインデックスを作成（検索用）
CREATE INDEX idx_philosophers_name ON philosophers(name);
