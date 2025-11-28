package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/HH19xx/philoCompass/internal/model"
)

// CreateAnswerRequest 回答作成リクエストの構造体
type CreateAnswerRequest struct {
	Answers []int16 `json:"answers" binding:"required"`
}

// CreateAnswerHandler 回答データを匿名で保存するハンドラー（統計用）
// 認証不要で誰でも投稿可能
func (h *Handler) CreateAnswerHandler(c *gin.Context) {
	var req CreateAnswerRequest

	// リクエストボディをバインド
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	// 回答数のチェック
	if len(req.Answers) != 16 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid answers count",
			"expected": 16,
			"received": len(req.Answers),
		})
		return
	}

	// 各回答が-2~2の範囲内かチェック
	for i, val := range req.Answers {
		if val < -2 || val > 2 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Answer values must be between -2 and 2",
				"index": i + 1,
			})
			return
		}
	}

	// モデル構造体を作成（UserIDはnil = 匿名）
	answer := &model.Answer{
		UserID:   nil,
		Answer01: req.Answers[0],
		Answer02: req.Answers[1],
		Answer03: req.Answers[2],
		Answer04: req.Answers[3],
		Answer05: req.Answers[4],
		Answer06: req.Answers[5],
		Answer07: req.Answers[6],
		Answer08: req.Answers[7],
		Answer09: req.Answers[8],
		Answer10: req.Answers[9],
		Answer11: req.Answers[10],
		Answer12: req.Answers[11],
		Answer13: req.Answers[12],
		Answer14: req.Answers[13],
		Answer15: req.Answers[14],
		Answer16: req.Answers[15],
	}

	// データベースに保存
	if err := h.answerRepo.CreateAnswer(answer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save answers"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Answers saved successfully",
		"answer_id": answer.ID,
	})
}

// LinkAnswerToUserHandler 匿名回答をユーザーに紐づけるハンドラー
// 認証必須
func (h *Handler) LinkAnswerToUserHandler(c *gin.Context) {
	var req struct {
		AnswerID int `json:"answer_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// JWTからユーザーIDを取得
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userID := userIDInterface.(int)

	// 回答をユーザーに紐づける
	if err := h.answerRepo.LinkAnswerToUser(req.AnswerID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to link answer to user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Answer linked to user successfully",
	})
}

// GetMyAnswersHandler ログインユーザーの最新回答を取得
func (h *Handler) GetMyAnswersHandler(c *gin.Context) {
	// JWTからユーザーIDを取得
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userID := userIDInterface.(int)

	answer, err := h.answerRepo.GetLatestAnswerByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve answers"})
		return
	}

	if answer == nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "No answers found"})
		return
	}

	c.JSON(http.StatusOK, answer)
}
