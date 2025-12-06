package service

import (
	"math"

	"github.com/HH19xx/philoCompass/internal/model"
)

// ClosestPhilosopher 最も近い哲学者の情報
type ClosestPhilosopher struct {
	Philosopher *model.Philosopher `json:"philosopher"`
	Distance    float64            `json:"distance"`
}

// FindClosestPhilosopher ユーザーの回答に最も近い哲学者を検索
func FindClosestPhilosopher(userAnswer *model.Answer, philosophers []model.Philosopher) *ClosestPhilosopher {
	if len(philosophers) == 0 {
		return nil
	}

	userVector := userAnswer.ToVector()
	var closest *model.Philosopher
	minDistance := math.MaxFloat64

	// 全哲学者との距離を計算
	for i := range philosophers {
		philoVector := philosophers[i].ToVector()
		distance := CalculateEuclideanDistance(userVector, philoVector)

		if distance < minDistance {
			minDistance = distance
			closest = &philosophers[i]
		}
	}

	if closest == nil {
		return nil
	}

	return &ClosestPhilosopher{
		Philosopher: closest,
		Distance:    minDistance,
	}
}

// CalculateEuclideanDistance 16次元ユークリッド距離を計算
func CalculateEuclideanDistance(v1, v2 model.AnswerVector) float64 {
	var sum float64
	for i := 0; i < 16; i++ {
		diff := float64(v1[i] - v2[i])
		sum += diff * diff
	}
	return math.Sqrt(sum)
}
