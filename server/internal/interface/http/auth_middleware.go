package http

import (
	nethttp "net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/HH19xx/philoCompass/internal/usecase"
)

// AuthMiddleware JWT認証ミドルウェア
func AuthMiddleware(authService *usecase.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Authorizationヘッダーからトークン取得
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(nethttp.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// "Bearer "プレフィックスを除去
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(nethttp.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			c.Abort()
			return
		}

		// トークン検証
		claims, err := authService.ValidateToken(tokenString)
		if err != nil {
			c.JSON(nethttp.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// ユーザーIDとユーザー名をコンテキストに保存
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)

		c.Next()
	}
}
