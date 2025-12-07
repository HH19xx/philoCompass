package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
)

type Config struct {
	DBType             string // "postgres" or "sqlite"
	SQLiteDBPath       string // SQLite使用時のファイルパス
	DBHost             string // PostgreSQL用
	DBPort             string
	DBUser             string
	DBPassword         string
	DBName             string
	DBSSLMode          string // PostgreSQL SSL mode
	ServerPort         string
	AppEnv             string // "development" or "production"
	FrontendURL        string // フロントエンドのURL
	GoogleClientID     string // Google OAuth クライアントID
	GoogleClientSecret string // Google OAuth クライアントシークレット
	GoogleRedirectURL  string // Google OAuth リダイレクトURL
}

func LoadConfig() *Config {
	return &Config{
		DBType:             getEnv("DB_TYPE", "sqlite"),
		SQLiteDBPath:       getEnv("SQLITE_DB_PATH", "./data/philocompass.db"),
		DBHost:             getEnv("DB_HOST", "db"),
		DBPort:             getEnv("DB_PORT", "5432"),
		DBUser:             getEnv("DB_USER", "philobot_user"),
		DBPassword:         getEnv("DB_PASSWORD", "strongpassword"),
		DBName:             getEnv("DB_NAME", "philobot"),
		DBSSLMode:          getEnv("DB_SSLMODE", "require"), // Supabase想定でデフォルトrequire
		ServerPort:         getEnv("PORT", "8081"),
		AppEnv:             getEnv("APP_ENV", "development"),
		FrontendURL:        getEnv("FRONTEND_URL", "http://localhost:5173"),
		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL:  getEnv("GOOGLE_REDIRECT_URL", "http://localhost:8081/api/auth/google/callback"),
	}
}

// ConnectDB DB_TYPEに応じてSQLiteまたはPostgreSQLに接続
func ConnectDB(cfg *Config) (*sql.DB, error) {
	switch cfg.DBType {
	case "sqlite":
		return ConnectSQLite(cfg)
	case "postgres":
		return ConnectPostgreSQL(cfg)
	default:
		// デフォルトはSQLite
		return ConnectSQLite(cfg)
	}
}

// ConnectSQLite SQLiteデータベースに接続（環境変数でPostgresかどちらかを選択）
func ConnectSQLite(cfg *Config) (*sql.DB, error) {
	// データベースファイルのディレクトリが存在しない場合は作成
	dbDir := filepath.Dir(cfg.SQLiteDBPath)
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create database directory: %w", err)
	}

	db, err := sql.Open("sqlite3", cfg.SQLiteDBPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open SQLite database: %w", err)
	}

	// 接続確認
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to ping SQLite database: %w", err)
	}

	log.Printf("Successfully connected to SQLite database: %s", cfg.SQLiteDBPath)
	return db, nil
}

// ConnectPostgreSQL PostgreSQLデータベースに接続（環境変数でSQLiteかどちらかを選択）
func ConnectPostgreSQL(cfg *Config) (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
	)

	var db *sql.DB
	var err error

	// リトライロジック: 最大30秒間、5秒ごとにリトライ
	maxRetries := 6
	retryInterval := 5 * time.Second

	for i := 0; i < maxRetries; i++ {
		db, err = sql.Open("postgres", dsn)
		if err != nil {
			log.Printf("Attempt %d/%d: Failed to open database: %v", i+1, maxRetries, err)
			time.Sleep(retryInterval)
			continue
		}

		err = db.Ping()
		if err == nil {
			log.Println("Successfully connected to PostgreSQL database")
			return db, nil
		}

		log.Printf("Attempt %d/%d: Failed to ping database: %v", i+1, maxRetries, err)
		db.Close()
		time.Sleep(retryInterval)
	}

	return nil, fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
