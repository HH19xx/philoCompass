package repository

import (
	"database/sql"

	"github.com/HH19xx/philoCompass/internal/model"
)

// AnswerRepository 回答データのリポジトリインターフェース
type AnswerRepository interface {
	// CreateAnswer 新規回答を保存
	CreateAnswer(answer *model.Answer) error
	// GetLatestAnswerByUserID ユーザーの最新回答を取得
	GetLatestAnswerByUserID(userID int) (*model.Answer, error)
	// GetAllAnswers すべての回答を取得（距離計算用）
	GetAllAnswers() ([]model.Answer, error)
	// LinkAnswerToUser 匿名回答をユーザーに紐づける
	LinkAnswerToUser(answerID int, userID int) error
	// GetAnswerByID IDで回答を取得
	GetAnswerByID(answerID int) (*model.Answer, error)
}

type answerRepository struct {
	db *sql.DB
}

// NewAnswerRepository AnswerRepositoryの新規インスタンスを作成
func NewAnswerRepository(db *sql.DB) AnswerRepository {
	return &answerRepository{db: db}
}

// CreateAnswer 回答データをDBに保存
func (r *answerRepository) CreateAnswer(answer *model.Answer) error {
	query := `
		INSERT INTO answers (
			user_id, answer_01, answer_02, answer_03, answer_04,
			answer_05, answer_06, answer_07, answer_08, answer_09,
			answer_10, answer_11, answer_12, answer_13, answer_14,
			answer_15, answer_16
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15, $16, $17
		) RETURNING id, created_at`

	err := r.db.QueryRow(
		query,
		answer.UserID,
		answer.Answer01, answer.Answer02, answer.Answer03, answer.Answer04,
		answer.Answer05, answer.Answer06, answer.Answer07, answer.Answer08,
		answer.Answer09, answer.Answer10, answer.Answer11, answer.Answer12,
		answer.Answer13, answer.Answer14, answer.Answer15, answer.Answer16,
	).Scan(&answer.ID, &answer.CreatedAt)

	return err
}

// GetLatestAnswerByUserID 指定ユーザーの最新回答を取得
func (r *answerRepository) GetLatestAnswerByUserID(userID int) (*model.Answer, error) {
	query := `
		SELECT id, user_id, answer_01, answer_02, answer_03, answer_04,
			answer_05, answer_06, answer_07, answer_08, answer_09,
			answer_10, answer_11, answer_12, answer_13, answer_14,
			answer_15, answer_16, created_at
		FROM answers
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 1`

	answer := &model.Answer{}
	err := r.db.QueryRow(query, userID).Scan(
		&answer.ID, &answer.UserID,
		&answer.Answer01, &answer.Answer02, &answer.Answer03, &answer.Answer04,
		&answer.Answer05, &answer.Answer06, &answer.Answer07, &answer.Answer08,
		&answer.Answer09, &answer.Answer10, &answer.Answer11, &answer.Answer12,
		&answer.Answer13, &answer.Answer14, &answer.Answer15, &answer.Answer16,
		&answer.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return answer, nil
}

// GetAllAnswers すべての回答データを取得（距離計算用）
func (r *answerRepository) GetAllAnswers() ([]model.Answer, error) {
	query := `
		SELECT id, user_id, answer_01, answer_02, answer_03, answer_04,
			answer_05, answer_06, answer_07, answer_08, answer_09,
			answer_10, answer_11, answer_12, answer_13, answer_14,
			answer_15, answer_16, created_at
		FROM answers
		ORDER BY created_at DESC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	answers := []model.Answer{}
	for rows.Next() {
		var answer model.Answer
		err := rows.Scan(
			&answer.ID, &answer.UserID,
			&answer.Answer01, &answer.Answer02, &answer.Answer03, &answer.Answer04,
			&answer.Answer05, &answer.Answer06, &answer.Answer07, &answer.Answer08,
			&answer.Answer09, &answer.Answer10, &answer.Answer11, &answer.Answer12,
			&answer.Answer13, &answer.Answer14, &answer.Answer15, &answer.Answer16,
			&answer.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		answers = append(answers, answer)
	}

	return answers, nil
}

// LinkAnswerToUser 匿名回答をユーザーに紐づける
func (r *answerRepository) LinkAnswerToUser(answerID int, userID int) error {
	query := `
		UPDATE answers
		SET user_id = $1
		WHERE id = $2 AND user_id IS NULL`

	result, err := r.db.Exec(query, userID, answerID)
	if err != nil {
		return err
	}

	// 更新された行数を確認
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// GetAnswerByID IDで回答を取得
func (r *answerRepository) GetAnswerByID(answerID int) (*model.Answer, error) {
	query := `
		SELECT id, user_id, answer_01, answer_02, answer_03, answer_04,
			answer_05, answer_06, answer_07, answer_08, answer_09,
			answer_10, answer_11, answer_12, answer_13, answer_14,
			answer_15, answer_16, created_at
		FROM answers
		WHERE id = $1`

	answer := &model.Answer{}
	err := r.db.QueryRow(query, answerID).Scan(
		&answer.ID, &answer.UserID,
		&answer.Answer01, &answer.Answer02, &answer.Answer03, &answer.Answer04,
		&answer.Answer05, &answer.Answer06, &answer.Answer07, &answer.Answer08,
		&answer.Answer09, &answer.Answer10, &answer.Answer11, &answer.Answer12,
		&answer.Answer13, &answer.Answer14, &answer.Answer15, &answer.Answer16,
		&answer.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return answer, nil
}
