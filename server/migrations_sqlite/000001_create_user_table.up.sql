CREATE TABLE "user" (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT NOT NULL UNIQUE,
    email           TEXT NOT NULL UNIQUE,
    password        TEXT NOT NULL,
    theme_settings  TEXT DEFAULT NULL,                        -- テーマ設定（JSON形式、将来の機能用）
    deleted         INTEGER DEFAULT 0 NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT (DATETIME('now')),
    created_by      TEXT,
    updated_at      DATETIME,
    updated_by      TEXT
);

CREATE INDEX idx_user_username ON "user" (username);
CREATE INDEX idx_user_email ON "user" (email);
