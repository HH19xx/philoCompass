# ビルドステージ
FROM golang:1.24-alpine AS builder

WORKDIR /app

# SQLiteビルドに必要なパッケージをインストール
RUN apk add --no-cache gcc musl-dev

# 依存関係のコピーとダウンロード
COPY go.mod go.sum* ./
RUN go mod download

# ソースコードのコピー（必要なディレクトリを明示）
COPY cmd ./cmd
COPY internal ./internal
COPY migrations_postgres ./migrations_postgres
COPY migrations_sqlite ./migrations_sqlite
COPY tools ./tools

# バイナリのビルド（CGO_ENABLED=1に変更してSQLiteをサポート）
RUN CGO_ENABLED=1 GOOS=linux go build -o server ./cmd/server

# 実行ステージ
FROM alpine:latest

WORKDIR /root/

# SQLiteランタイムライブラリをインストール
RUN apk add --no-cache sqlite-libs

# ビルドステージからバイナリをコピー
COPY --from=builder /app/server .
COPY --from=builder /app/migrations_postgres ./migrations_postgres
COPY --from=builder /app/migrations_sqlite ./migrations_sqlite

# データディレクトリ作成
RUN mkdir -p /app/data

# ポート公開
EXPOSE 8081

# サーバー起動
CMD ["./server"]
