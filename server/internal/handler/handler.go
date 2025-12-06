package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/HH19xx/philoCompass/internal/repository"
	"github.com/HH19xx/philoCompass/internal/service"
)

type Handler struct {
	userRepo          repository.UserRepository
	answerRepo        repository.AnswerRepository
	philosopherRepo   repository.PhilosopherRepository
	authService       *service.AuthService
	googleOAuthConfig *GoogleOAuthConfig
}

func NewHandler(userRepo repository.UserRepository, answerRepo repository.AnswerRepository, philosopherRepo repository.PhilosopherRepository, authService *service.AuthService, googleOAuthConfig *GoogleOAuthConfig) *Handler {
	return &Handler{
		userRepo:          userRepo,
		answerRepo:        answerRepo,
		philosopherRepo:   philosopherRepo,
		authService:       authService,
		googleOAuthConfig: googleOAuthConfig,
	}
}

func (h *Handler) HelloHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "こんにちは、みなさん!",
	})
}
