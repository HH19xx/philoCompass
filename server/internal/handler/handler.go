package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/HH19xx/philoCompass/internal/repository"
	"github.com/HH19xx/philoCompass/internal/service"
)

type Handler struct {
	userRepo    repository.UserRepository
	answerRepo  repository.AnswerRepository
	authService *service.AuthService
}

func NewHandler(userRepo repository.UserRepository, answerRepo repository.AnswerRepository, authService *service.AuthService) *Handler {
	return &Handler{
		userRepo:    userRepo,
		answerRepo:  answerRepo,
		authService: authService,
	}
}

func (h *Handler) HelloHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "こんにちは、みなさん!",
	})
}
