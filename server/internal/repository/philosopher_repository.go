package repository

import (
	"database/sql"

	"github.com/HH19xx/philoCompass/internal/model"
)

// PhilosopherRepository 哲学者データのリポジトリインターフェース
type PhilosopherRepository interface {
	// GetAllPhilosophers すべての哲学者データを取得（論理削除されていないもののみ）
	GetAllPhilosophers() ([]model.Philosopher, error)
	// GetPhilosopherByID IDで哲学者を取得
	GetPhilosopherByID(id int) (*model.Philosopher, error)
}

type philosopherRepository struct {
	db *sql.DB
}

// NewPhilosopherRepository PhilosopherRepositoryの新規インスタンスを作成
func NewPhilosopherRepository(db *sql.DB) PhilosopherRepository {
	return &philosopherRepository{db: db}
}

// GetAllPhilosophers すべての哲学者データを取得
func (r *philosopherRepository) GetAllPhilosophers() ([]model.Philosopher, error) {
	query := `
		SELECT id, name, era, description,
			answer_01, answer_02, answer_03, answer_04,
			answer_05, answer_06, answer_07, answer_08,
			answer_09, answer_10, answer_11, answer_12,
			answer_13, answer_14, answer_15, answer_16,
			deleted, created_at, created_by, updated_at, updated_by
		FROM philosophers
		WHERE deleted = false
		ORDER BY created_at ASC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	philosophers := []model.Philosopher{}
	for rows.Next() {
		var p model.Philosopher
		err := rows.Scan(
			&p.ID, &p.Name, &p.Era, &p.Description,
			&p.Answer01, &p.Answer02, &p.Answer03, &p.Answer04,
			&p.Answer05, &p.Answer06, &p.Answer07, &p.Answer08,
			&p.Answer09, &p.Answer10, &p.Answer11, &p.Answer12,
			&p.Answer13, &p.Answer14, &p.Answer15, &p.Answer16,
			&p.Deleted, &p.CreatedAt, &p.CreatedBy, &p.UpdatedAt, &p.UpdatedBy,
		)
		if err != nil {
			return nil, err
		}
		philosophers = append(philosophers, p)
	}

	return philosophers, nil
}

// GetPhilosopherByID IDで哲学者を取得
func (r *philosopherRepository) GetPhilosopherByID(id int) (*model.Philosopher, error) {
	query := `
		SELECT id, name, era, description,
			answer_01, answer_02, answer_03, answer_04,
			answer_05, answer_06, answer_07, answer_08,
			answer_09, answer_10, answer_11, answer_12,
			answer_13, answer_14, answer_15, answer_16,
			deleted, created_at, created_by, updated_at, updated_by
		FROM philosophers
		WHERE id = $1 AND deleted = false`

	p := &model.Philosopher{}
	err := r.db.QueryRow(query, id).Scan(
		&p.ID, &p.Name, &p.Era, &p.Description,
		&p.Answer01, &p.Answer02, &p.Answer03, &p.Answer04,
		&p.Answer05, &p.Answer06, &p.Answer07, &p.Answer08,
		&p.Answer09, &p.Answer10, &p.Answer11, &p.Answer12,
		&p.Answer13, &p.Answer14, &p.Answer15, &p.Answer16,
		&p.Deleted, &p.CreatedAt, &p.CreatedBy, &p.UpdatedAt, &p.UpdatedBy,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return p, nil
}
