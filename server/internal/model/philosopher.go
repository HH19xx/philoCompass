package model

import "time"

// Philosopher 哲学者の回答データを表す構造体
type Philosopher struct {
	ID          int        `json:"id"`
	Name        string     `json:"name"`
	Era         string     `json:"era"`
	Description string     `json:"description"`
	Answer01    int16      `json:"answer_01"`
	Answer02    int16      `json:"answer_02"`
	Answer03    int16      `json:"answer_03"`
	Answer04    int16      `json:"answer_04"`
	Answer05    int16      `json:"answer_05"`
	Answer06    int16      `json:"answer_06"`
	Answer07    int16      `json:"answer_07"`
	Answer08    int16      `json:"answer_08"`
	Answer09    int16      `json:"answer_09"`
	Answer10    int16      `json:"answer_10"`
	Answer11    int16      `json:"answer_11"`
	Answer12    int16      `json:"answer_12"`
	Answer13    int16      `json:"answer_13"`
	Answer14    int16      `json:"answer_14"`
	Answer15    int16      `json:"answer_15"`
	Answer16    int16      `json:"answer_16"`
	Deleted     bool       `json:"deleted"`
	CreatedAt   time.Time  `json:"created_at"`
	CreatedBy   *string    `json:"created_by,omitempty"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
	UpdatedBy   *string    `json:"updated_by,omitempty"`
}

// ToVector Philosopher構造体から16次元ベクトルを抽出
func (p *Philosopher) ToVector() AnswerVector {
	return AnswerVector{
		p.Answer01, p.Answer02, p.Answer03, p.Answer04,
		p.Answer05, p.Answer06, p.Answer07, p.Answer08,
		p.Answer09, p.Answer10, p.Answer11, p.Answer12,
		p.Answer13, p.Answer14, p.Answer15, p.Answer16,
	}
}
