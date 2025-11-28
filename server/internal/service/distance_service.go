package service

import (
	"math"

	"github.com/HH19xx/philoCompass/internal/model"
)

// DistanceService 距離計算のサービス
type DistanceService struct{}

// NewDistanceService DistanceServiceの新規インスタンスを作成
func NewDistanceService() *DistanceService {
	return &DistanceService{}
}

// CalculateEuclideanDistance 2つの16次元ベクトル間のユークリッド距離を計算
func (s *DistanceService) CalculateEuclideanDistance(v1, v2 model.AnswerVector) float64 {
	var sum float64
	for i := 0; i < 16; i++ {
		diff := float64(v1[i] - v2[i])
		sum += diff * diff
	}
	return math.Sqrt(sum)
}

// CountNeighbors 指定した回答から半径r以内にある回答の数をカウント
func (s *DistanceService) CountNeighbors(target model.AnswerVector, allAnswers []model.Answer, radius float64) int {
	count := 0
	for _, answer := range allAnswers {
		vec := answer.ToVector()
		distance := s.CalculateEuclideanDistance(target, vec)
		if distance <= radius {
			count++
		}
	}
	// 自分自身は除外（距離0の場合）
	if count > 0 {
		count--
	}
	return count
}

// NeighborDistribution 複数半径での近傍ユーザー数を取得
type NeighborDistribution struct {
	Radius float64 `json:"radius"`
	Count  int     `json:"count"`
}

// GetNeighborDistribution 複数の半径での近傍ユーザー数を取得
func (s *DistanceService) GetNeighborDistribution(target model.AnswerVector, allAnswers []model.Answer, radii []float64) []NeighborDistribution {
	result := make([]NeighborDistribution, len(radii))
	for i, radius := range radii {
		result[i] = NeighborDistribution{
			Radius: radius,
			Count:  s.CountNeighbors(target, allAnswers, radius),
		}
	}
	return result
}
