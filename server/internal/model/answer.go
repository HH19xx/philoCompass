package model

import "time"

// Answer ユーザーの16次元回答ベクトルを表す構造体
// UserIDがnilの場合は匿名の統計データとして扱う
type Answer struct {
	ID        int       `json:"id"`
	UserID    *int      `json:"user_id,omitempty"`
	Answer01  int16     `json:"answer_01"`
	Answer02  int16     `json:"answer_02"`
	Answer03  int16     `json:"answer_03"`
	Answer04  int16     `json:"answer_04"`
	Answer05  int16     `json:"answer_05"`
	Answer06  int16     `json:"answer_06"`
	Answer07  int16     `json:"answer_07"`
	Answer08  int16     `json:"answer_08"`
	Answer09  int16     `json:"answer_09"`
	Answer10  int16     `json:"answer_10"`
	Answer11  int16     `json:"answer_11"`
	Answer12  int16     `json:"answer_12"`
	Answer13  int16     `json:"answer_13"`
	Answer14  int16     `json:"answer_14"`
	Answer15  int16     `json:"answer_15"`
	Answer16  int16     `json:"answer_16"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

// AnswerVector 16次元の回答ベクトルのみを表す構造体（配列形式でも扱いやすいように）
type AnswerVector [16]int16

// ToVector Answer構造体から16次元ベクトルを抽出
func (a *Answer) ToVector() AnswerVector {
	return AnswerVector{
		a.Answer01, a.Answer02, a.Answer03, a.Answer04,
		a.Answer05, a.Answer06, a.Answer07, a.Answer08,
		a.Answer09, a.Answer10, a.Answer11, a.Answer12,
		a.Answer13, a.Answer14, a.Answer15, a.Answer16,
	}
}
