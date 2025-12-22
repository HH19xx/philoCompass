package http

import (
	nethttp "net/http"

	"github.com/HH19xx/philoCompass/internal/infra/db"
	"github.com/HH19xx/philoCompass/internal/usecase"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	userRepo          db.UserRepository
	answerRepo        db.AnswerRepository
	philosopherRepo   db.PhilosopherRepository
	authService       *usecase.AuthService
	googleOAuthConfig *GoogleOAuthConfig
}

func NewHandler(userRepo db.UserRepository, answerRepo db.AnswerRepository, philosopherRepo db.PhilosopherRepository, authService *usecase.AuthService, googleOAuthConfig *GoogleOAuthConfig) *Handler {
	return &Handler{
		userRepo:          userRepo,
		answerRepo:        answerRepo,
		philosopherRepo:   philosopherRepo,
		authService:       authService,
		googleOAuthConfig: googleOAuthConfig,
	}
}

func (h *Handler) HelloHandler(c *gin.Context) {
	c.JSON(nethttp.StatusOK, gin.H{
		"message": "こんにちは、みなさん!",
	})
}
