package service

import "github.com/HH19xx/philoCompass/internal/model"

// CategoryScores カテゴリごとの合計スコア
type CategoryScores struct {
	Logic      int16 // Q1-Q3の合計
	Ethics     int16 // Q4-Q6の合計
	Aesthetics int16 // Q7-Q9の合計
	Postmodern int16 // Q10-Q12の合計
}

// SubIndicators 横断的サブ指標の個別スコア
type SubIndicators struct {
	Q13 int16 // 不可知論 vs 可知論
	Q14 int16 // 義務論 vs 帰結主義
	Q15 int16 // 科学的 vs 人文的
	Q16 int16 // 論理 vs 現象学
}

// PhiloLabel MBTI風の哲学ラベル
type PhiloLabel struct {
	MainLabel string         `json:"main_label"` // 例: "SVOP"
	SubLabel  string         `json:"sub_label"`  // 例: "LDSA"
	FullLabel string         `json:"full_label"` // 例: "SVOP-LDSA"
	Category  CategoryScores `json:"category_scores"`
	SubScores SubIndicators  `json:"sub_scores"`
}

// CalculatePhiloLabel 回答から哲学ラベルを計算
func CalculatePhiloLabel(answer *model.Answer) PhiloLabel {
	// カテゴリスコアを計算
	categoryScores := CategoryScores{
		Logic:      answer.Answer01 + answer.Answer02 + answer.Answer03,
		Ethics:     answer.Answer04 + answer.Answer05 + answer.Answer06,
		Aesthetics: answer.Answer07 + answer.Answer08 + answer.Answer09,
		Postmodern: answer.Answer10 + answer.Answer11 + answer.Answer12,
	}

	// サブ指標スコア
	subScores := SubIndicators{
		Q13: answer.Answer13,
		Q14: answer.Answer14,
		Q15: answer.Answer15,
		Q16: answer.Answer16,
	}

	// メインラベルを生成（4文字）
	mainLabel := ""
	mainLabel += getLogicLabel(categoryScores.Logic)
	mainLabel += getEthicsLabel(categoryScores.Ethics)
	mainLabel += getAestheticsLabel(categoryScores.Aesthetics)
	mainLabel += getPostmodernLabel(categoryScores.Postmodern)

	// サブラベルを生成（4文字）Q13-Q16の順序で
	subLabel := ""
	subLabel += getQ13Label(subScores.Q13) // 不可知論 vs 可知論
	subLabel += getQ14Label(subScores.Q14) // 義務論 vs 帰結主義
	subLabel += getQ15Label(subScores.Q15) // 科学的 vs 人文的
	subLabel += getQ16Label(subScores.Q16) // 論理 vs 現象学

	fullLabel := mainLabel + "-" + subLabel

	return PhiloLabel{
		MainLabel: mainLabel,
		SubLabel:  subLabel,
		FullLabel: fullLabel,
		Category:  categoryScores,
		SubScores: subScores,
	}
}

// 論理カテゴリのラベル判定
func getLogicLabel(score int16) string {
	if score >= 0 {
		return "N" // Narrative（大きな物語志向）
	}
	return "S" // Structure（構造志向）
}

// 倫理カテゴリのラベル判定
func getEthicsLabel(score int16) string {
	if score >= 0 {
		return "V" // Virtue（徳論志向）
	}
	return "A" // Act（行為論志向）
}

// 美学カテゴリのラベル判定
func getAestheticsLabel(score int16) string {
	if score >= 0 {
		return "O" // Ontology（存在論志向）
	}
	return "E" // Epistemology（認識論志向）
}

// ポストモダンカテゴリのラベル判定
func getPostmodernLabel(score int16) string {
	if score >= 0 {
		return "P" // Postmodern（ポストモダン志向）
	}
	return "M" // Modern（モダン志向）
}

// Q16のラベル判定（直観と論理なら、論理のほうを信じる）
func getQ16Label(score int16) string {
	if score >= 0 {
		return "L" // Logic（分析哲学的）
	}
	return "P" // Phenomenology（現象学的）
}

// Q14のラベル判定（基本的に嘘をつくことは悪いことだ）
func getQ14Label(score int16) string {
	if score >= 0 {
		return "D" // Deontology（義務論的）
	}
	return "C" // Consequentialism（帰結主義的）
}

// Q15のラベル判定（自然科学や社会科学はいずれ多くの哲学的問題を解決するだろう）
func getQ15Label(score int16) string {
	if score >= 0 {
		return "S" // Scientific（科学的）
	}
	return "H" // Humanistic（人文的）
}

// Q13のラベル判定（人間に絶対に知りえないことはある）
func getQ13Label(score int16) string {
	if score >= 0 {
		return "A" // Agnostic（不可知論的）
	}
	return "K" // Knowable（可知論的）
}
