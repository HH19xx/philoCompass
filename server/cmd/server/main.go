package main

import (
	"log"
	"os"

	"github.com/HH19xx/philoCompass/internal/config"
	"github.com/HH19xx/philoCompass/internal/handler"
	"github.com/HH19xx/philoCompass/internal/middleware"
	"github.com/HH19xx/philoCompass/internal/repository"
	"github.com/HH19xx/philoCompass/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// 設定の読み込み
	cfg := config.LoadConfig()

	// データベース接続
	db, err := config.ConnectDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// マイグレーション実行（DB_TYPEを渡す）
	if err := config.RunMigrations(db, cfg.DBType); err != nil {
		log.Printf("Migration warning: %v", err)
	}

	// シードデータ投入（DB_TYPEを渡す）
	if err := config.RunSeeds(db, cfg.DBType); err != nil {
		log.Printf("Seed warning: %v", err)
	}

	// サービスの初期化
	authService := service.NewAuthService()

	// Google OAuth設定の初期化
	googleOAuthConfig := handler.NewGoogleOAuthConfig(
		cfg.GoogleClientID,
		cfg.GoogleClientSecret,
		cfg.GoogleRedirectURL,
		cfg.AppEnv,
		cfg.FrontendURL,
	)

	// リポジトリの初期化
	userRepo := repository.NewUserRepository(db)
	answerRepo := repository.NewAnswerRepository(db)
	philosopherRepo := repository.NewPhilosopherRepository(db)

	// ハンドラーの初期化
	h := handler.NewHandler(userRepo, answerRepo, philosopherRepo, authService, googleOAuthConfig)

	// Ginルーターの設定
	r := gin.Default()

	// CORS設定
	r.Use(corsMiddleware())

	// 認証不要なルーティング
	api := r.Group("/api")
	{
		api.GET("/hello", h.HelloHandler)
		api.POST("/register", h.RegisterHandler)
		api.POST("/login", h.LoginHandler)
		api.POST("/answers", h.CreateAnswerHandler)                                                         // 匿名での回答保存（統計用）
		api.GET("/statistics/distribution/:answer_id", h.GetNeighborDistributionByAnswerIDHandler)          // 特定回答の統計取得
		api.GET("/statistics/category-distribution/:answer_id", h.GetCategoryDistributionByAnswerIDHandler) // カテゴリ別スコア分布取得

		// Google OAuth認証
		api.GET("/auth/google", h.GoogleLoginHandler)             // Google認証ページへリダイレクト
		api.GET("/auth/google/callback", h.GoogleCallbackHandler) // Google認証後のコールバック
	}

	// 認証が必要なルーティング
	authAPI := r.Group("/api")
	authAPI.Use(middleware.AuthMiddleware(authService))
	{
		authAPI.POST("/answers/link", h.LinkAnswerToUserHandler) // 回答をユーザーに紐づける
		authAPI.GET("/answers/me", h.GetMyAnswersHandler)
		authAPI.GET("/statistics/neighbors", h.GetNeighborsHandler)
		authAPI.GET("/statistics/distribution", h.GetNeighborDistributionHandler)
	}

	// サーバー起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
