package handler

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/HH19xx/philoCompass/internal/model"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// GoogleOAuthConfig Google OAuth2設定を保持する構造体
type GoogleOAuthConfig struct {
	Config      *oauth2.Config
	appEnv      string
	frontendURL string
}

// NewGoogleOAuthConfig Google OAuth2設定を初期化
func NewGoogleOAuthConfig(clientID, clientSecret, redirectURL, appEnv, frontendURL string) *GoogleOAuthConfig {
	return &GoogleOAuthConfig{
		Config: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURL:  redirectURL,
			Scopes: []string{
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile",
			},
			Endpoint: google.Endpoint,
		},
		appEnv:      appEnv,
		frontendURL: frontendURL,
	}
}

// generateStateToken CSRF対策用のランダムなstate文字列を生成
func generateStateToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

// GoogleLoginHandler Google認証ページへリダイレクト
func (h *Handler) GoogleLoginHandler(c *gin.Context) {
	// 本番環境ではランダムなstate文字列を生成してセッションに保存
	var state string
	var err error
	
	if h.googleOAuthConfig.appEnv == "production" {
		// 本番環境: ランダムなstate文字列を生成
		state, err = generateStateToken()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "State生成エラー"})
			return
		}
		// TODO: 本番環境ではstateをセッションストアに保存して検証する
		// 例: session.Set("oauth_state", state)
	} else {
		// 開発環境: 固定値
		state = "dev-state-string"
	}
	
	url := h.googleOAuthConfig.Config.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// GoogleCallbackHandler Google認証後のコールバック処理
func (h *Handler) GoogleCallbackHandler(c *gin.Context) {
	// stateパラメータの検証
	state := c.Query("state")
	if h.googleOAuthConfig.appEnv == "production" {
		// TODO: 本番環境ではセッションストアからstateを取得して検証
		// savedState := session.Get("oauth_state")
		// if state != savedState {
		//     c.JSON(http.StatusBadRequest, gin.H{"error": "無効なstateパラメータ"})
		//     return
		// }
		if state == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "stateパラメータが不正です"})
			return
		}
	}
	
	// 認証コードを取得
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "認証コードが取得できませんでした"})
		return
	}

	// 認証コードをトークンに交換
	token, err := h.googleOAuthConfig.Config.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トークンの取得に失敗しました"})
		return
	}

	// ユーザー情報を取得
	client := h.googleOAuthConfig.Config.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー情報の取得に失敗しました"})
		return
	}
	defer resp.Body.Close()

	// ユーザー情報をパース
	var googleUser struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー情報のパースに失敗しました"})
		return
	}

	// データベースでユーザーを検索または作成
	user, err := h.userRepo.GetUserByGoogleID(googleUser.ID)
	if err != nil {
		// ユーザーが存在しない場合は新規作成
		newUser := &model.User{
			Username: googleUser.Name,
			Email:    &googleUser.Email,
			GoogleID: &googleUser.ID,
		}
		userID, err := h.userRepo.CreateUserWithGoogle(newUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("ユーザーの作成に失敗しました: %v", err)})
			return
		}
		newUser.ID = userID
		user = newUser
	}

	// JWTトークンを生成
	jwtToken, err := h.authService.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トークンの生成に失敗しました"})
		return
	}

	// フロントエンドにリダイレクト
	var redirectURL string
	if h.googleOAuthConfig.appEnv == "production" {
		// 本番環境: URLパラメータでトークンとユーザー情報を渡す
		// フロントエンド側で受け取った後、すぐにURLパラメータをクリアするため安全性は保たれる
		redirectURL = fmt.Sprintf("%s/?token=%s&user=%s&user_id=%d", h.googleOAuthConfig.frontendURL, jwtToken, user.Username, user.ID)
	} else if h.googleOAuthConfig.appEnv == "development" {
		// 開発環境: URLパラメータでトークンとユーザー情報を渡す
		redirectURL = fmt.Sprintf("%s/?token=%s&user=%s&user_id=%d", h.googleOAuthConfig.frontendURL, jwtToken, user.Username, user.ID)
	} else {
		// 不明な環境の場合はエラーを返す
		c.JSON(http.StatusInternalServerError, gin.H{"error": "不正な環境設定です"})
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}
