-- 回答履歴テーブル
-- ユーザーごとの16次元回答ベクトルを保存
CREATE TABLE answers (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    -- 16次元の回答データ (-2 ~ 2の5段階評価)
    answer_01       SMALLINT NOT NULL CHECK (answer_01 BETWEEN -2 AND 2),
    answer_02       SMALLINT NOT NULL CHECK (answer_02 BETWEEN -2 AND 2),
    answer_03       SMALLINT NOT NULL CHECK (answer_03 BETWEEN -2 AND 2),
    answer_04       SMALLINT NOT NULL CHECK (answer_04 BETWEEN -2 AND 2),
    answer_05       SMALLINT NOT NULL CHECK (answer_05 BETWEEN -2 AND 2),
    answer_06       SMALLINT NOT NULL CHECK (answer_06 BETWEEN -2 AND 2),
    answer_07       SMALLINT NOT NULL CHECK (answer_07 BETWEEN -2 AND 2),
    answer_08       SMALLINT NOT NULL CHECK (answer_08 BETWEEN -2 AND 2),
    answer_09       SMALLINT NOT NULL CHECK (answer_09 BETWEEN -2 AND 2),
    answer_10       SMALLINT NOT NULL CHECK (answer_10 BETWEEN -2 AND 2),
    answer_11       SMALLINT NOT NULL CHECK (answer_11 BETWEEN -2 AND 2),
    answer_12       SMALLINT NOT NULL CHECK (answer_12 BETWEEN -2 AND 2),
    answer_13       SMALLINT NOT NULL CHECK (answer_13 BETWEEN -2 AND 2),
    answer_14       SMALLINT NOT NULL CHECK (answer_14 BETWEEN -2 AND 2),
    answer_15       SMALLINT NOT NULL CHECK (answer_15 BETWEEN -2 AND 2),
    answer_16       SMALLINT NOT NULL CHECK (answer_16 BETWEEN -2 AND 2),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP
);

-- ユーザーIDでの検索を高速化
CREATE INDEX idx_answers_user_id ON answers (user_id);

-- 最新の回答のみを取得するための複合インデックス
CREATE INDEX idx_answers_user_created ON answers (user_id, created_at DESC);
