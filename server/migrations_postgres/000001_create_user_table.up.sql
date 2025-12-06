CREATE TABLE "user" (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(255) UNIQUE,                      -- OAuth認証時はNULLの可能性あり
    password        VARCHAR(255),                             -- OAuth認証時はNULLの可能性あり
    google_id       VARCHAR(255) UNIQUE,                      -- Google OAuthのユーザーID
    deleted         BOOLEAN DEFAULT FALSE NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(50),
    updated_at      TIMESTAMP,
    updated_by      VARCHAR(50)
);

CREATE INDEX idx_user_username ON "user" (username);
CREATE INDEX idx_user_email ON "user" (email);
CREATE INDEX idx_user_google_id ON "user" (google_id);       -- Google IDでの検索用
