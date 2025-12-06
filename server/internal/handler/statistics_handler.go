package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/HH19xx/philoCompass/internal/model"
	"github.com/HH19xx/philoCompass/internal/service"
)

// GetNeighborsHandler 指定半径内の近傍ユーザー数を取得
func (h *Handler) GetNeighborsHandler(c *gin.Context) {
	// クエリパラメータから半径を取得
	radiusStr := c.DefaultQuery("radius", "3.0")
	radius, err := strconv.ParseFloat(radiusStr, 64)
	if err != nil || radius < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid radius parameter"})
		return
	}

	// JWTからユーザーIDを取得
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userID := userIDInterface.(int)

	// ユーザーの最新回答を取得
	userAnswer, err := h.answerRepo.GetLatestAnswerByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user answers"})
		return
	}
	if userAnswer == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User has not answered yet"})
		return
	}

	// すべての回答を取得
	allAnswers, err := h.answerRepo.GetAllAnswers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve all answers"})
		return
	}

	// 距離計算サービスを使用
	distanceService := service.NewDistanceService()
	targetVector := userAnswer.ToVector()
	count := distanceService.CountNeighbors(targetVector, allAnswers, radius)

	c.JSON(http.StatusOK, gin.H{
		"radius": radius,
		"count":  count,
	})
}

// GetNeighborDistributionHandler 複数半径での近傍ユーザー数分布を取得
func (h *Handler) GetNeighborDistributionHandler(c *gin.Context) {
	// JWTからユーザーIDを取得
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userID := userIDInterface.(int)

	// ユーザーの最新回答を取得
	userAnswer, err := h.answerRepo.GetLatestAnswerByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user answers"})
		return
	}
	if userAnswer == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User has not answered yet"})
		return
	}

	// すべての回答を取得
	allAnswers, err := h.answerRepo.GetAllAnswers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve all answers"})
		return
	}

	// 複数の半径で計算（1, 2, 3, 5, 10）
	radii := []float64{1.0, 2.0, 3.0, 5.0, 10.0}
	distanceService := service.NewDistanceService()
	targetVector := userAnswer.ToVector()
	distribution := distanceService.GetNeighborDistribution(targetVector, allAnswers, radii)

	c.JSON(http.StatusOK, gin.H{
		"distribution": distribution,
	})
}

// GetNeighborDistributionByAnswerIDHandler 指定した回答IDの近傍ユーザー数分布を取得（認証不要）
func (h *Handler) GetNeighborDistributionByAnswerIDHandler(c *gin.Context) {
	// パスパラメータから回答IDを取得
	answerIDStr := c.Param("answer_id")
	answerID, err := strconv.Atoi(answerIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid answer_id"})
		return
	}

	// 指定された回答を取得
	answer, err := h.answerRepo.GetAnswerByID(answerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve answer"})
		return
	}
	if answer == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Answer not found"})
		return
	}

	// すべての回答を取得
	allAnswers, err := h.answerRepo.GetAllAnswers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve all answers"})
		return
	}

	// 複数の半径で計算（1, 2, 3, 5, 10）
	radii := []float64{1.0, 2.0, 3.0, 5.0, 10.0}
	distanceService := service.NewDistanceService()
	targetVector := answer.ToVector()
	distribution := distanceService.GetNeighborDistribution(targetVector, allAnswers, radii)

	// 哲学ラベルを計算
	philoLabel := service.CalculatePhiloLabel(answer)

	// 最近傍哲学者を検索
	philosophers, err := h.philosopherRepo.GetAllPhilosophers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve philosophers"})
		return
	}
	closestPhilosopher := service.FindClosestPhilosopher(answer, philosophers)

	c.JSON(http.StatusOK, gin.H{
		"distribution":         distribution,
		"answer":               answer,
		"label":                philoLabel,
		"closest_philosopher":  closestPhilosopher,
	})
}

// GetCategoryDistributionByAnswerIDHandler 指定した回答IDのカテゴリ別スコア分布を取得（認証不要）
func (h *Handler) GetCategoryDistributionByAnswerIDHandler(c *gin.Context) {
	// パスパラメータから回答IDを取得
	answerIDStr := c.Param("answer_id")
	answerID, err := strconv.Atoi(answerIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid answer_id"})
		return
	}

	// 指定された回答を取得
	answer, err := h.answerRepo.GetAnswerByID(answerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve answer"})
		return
	}
	if answer == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Answer not found"})
		return
	}

	// すべての回答を取得
	allAnswers, err := h.answerRepo.GetAllAnswers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve all answers"})
		return
	}

	// []model.Answerを[]*model.Answerに変換
	var answerPointers []*model.Answer
	for i := range allAnswers {
		answerPointers = append(answerPointers, &allAnswers[i])
	}

	// カテゴリ別スコア分布を計算
	distributions := service.CalculateCategoryDistributions(answerPointers)

	c.JSON(http.StatusOK, distributions)
}
