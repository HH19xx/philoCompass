package service

import "github.com/HH19xx/philoCompass/internal/model"

// CategoryDistribution カテゴリごとのスコア分布
type CategoryDistribution struct {
	Score int `json:"score"`
	Count int `json:"count"`
}

// AllCategoryDistributions 全カテゴリの分布データ
type AllCategoryDistributions struct {
	// 構造体タグ: JSON変換時のフィールド名を指定（GoのScoreフィールドがJSONの"score"になる）
	Logic      []CategoryDistribution `json:"logic"`
	Ethics     []CategoryDistribution `json:"ethics"`
	Aesthetics []CategoryDistribution `json:"aesthetics"`
	Postmodern []CategoryDistribution `json:"postmodern"`
}

// CalculateCategoryDistributions 全ユーザーの各カテゴリスコア分布を計算
func CalculateCategoryDistributions(answers []*model.Answer) AllCategoryDistributions {
	// -6 ~ +6の各スコアの出現回数を初期化
	logicMap := make(map[int16]int)
	ethicsMap := make(map[int16]int)
	aestheticsMap := make(map[int16]int)
	postmodernMap := make(map[int16]int)

	// 各ユーザーのカテゴリスコアを集計
	for _, answer := range answers {
		logicScore := answer.Answer01 + answer.Answer02 + answer.Answer03
		ethicsScore := answer.Answer04 + answer.Answer05 + answer.Answer06
		aestheticsScore := answer.Answer07 + answer.Answer08 + answer.Answer09
		postmodernScore := answer.Answer10 + answer.Answer11 + answer.Answer12

		logicMap[logicScore]++
		ethicsMap[ethicsScore]++
		aestheticsMap[aestheticsScore]++
		postmodernMap[postmodernScore]++
	}

	// -6 ~ +6の全スコアについてデータを生成（カウント0も含む）
	return AllCategoryDistributions{
		Logic:      buildDistribution(logicMap),
		Ethics:     buildDistribution(ethicsMap),
		Aesthetics: buildDistribution(aestheticsMap),
		Postmodern: buildDistribution(postmodernMap),
	}
}

// buildDistribution -6 ~ +6の全スコアについてCategoryDistributionを生成
func buildDistribution(scoreMap map[int16]int) []CategoryDistribution {
	result := make([]CategoryDistribution, 0, 13)
	for score := int16(-6); score <= 6; score++ {
		count := scoreMap[score]
		result = append(result, CategoryDistribution{
			Score: int(score),
			Count: count,
		})
	}
	return result
}
