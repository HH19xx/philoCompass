package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/HH19xx/philoCompass/internal/model"
	"golang.org/x/crypto/bcrypt"
)

// RegisterRequest ユーザー登録リクエスト
type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest ログインリクエスト
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// RegisterHandler ユーザー登録ハンドラー
func (h *Handler) RegisterHandler(c *gin.Context) {
	var req RegisterRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// ユーザー名の重複チェック
	existingUser, _ := h.userRepo.FindByUsername(req.Username)
	if existingUser != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	// メールアドレスの重複チェック
	existingEmail, _ := h.userRepo.FindByEmail(req.Email)
	if existingEmail != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	// パスワードのハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// ユーザー作成（ポインタ型に変換）
	email := req.Email
	password := string(hashedPassword)
	createdBy := "self"

	user := &model.User{
		Username:  req.Username,
		Email:     &email,
		Password:  &password,
		CreatedBy: &createdBy,
	}

	if err := h.userRepo.Create(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// パスワードを含めずにレスポンス
	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

// LoginHandler ログインハンドラー（JWT発行）
func (h *Handler) LoginHandler(c *gin.Context) {
	var req LoginRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// ユーザー検索
	user, err := h.userRepo.FindByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// パスワード検証（Google OAuth認証のみのユーザーはパスワードがNULL）
	if user.Password == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "This account uses Google login. Please sign in with Google."})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(*user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// JWTトークン生成
	token, err := h.authService.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}
