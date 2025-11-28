package repository

import (
	"database/sql"
	"fmt"

	"github.com/HH19xx/philoCompass/internal/model"
)

type UserRepository interface {
	Create(user *model.User) error
	FindByID(id int) (*model.User, error)
	FindByUsername(username string) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	Update(user *model.User) error
	Delete(id int) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *model.User) error {
	query := `
		INSERT INTO "user" (username, email, password, created_by)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`
	return r.db.QueryRow(
		query,
		user.Username,
		user.Email,
		user.Password,
		user.CreatedBy,
	).Scan(&user.ID, &user.CreatedAt)
}

func (r *userRepository) FindByID(id int) (*model.User, error) {
	query := `
		SELECT id, username, email, password, deleted, created_at, created_by, updated_at, updated_by
		FROM "user"
		WHERE id = $1 AND deleted = false
	`
	user := &model.User{}
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Deleted,
		&user.CreatedAt,
		&user.CreatedBy,
		&user.UpdatedAt,
		&user.UpdatedBy,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	return user, err
}

func (r *userRepository) FindByUsername(username string) (*model.User, error) {
	query := `
		SELECT id, username, email, password, deleted, created_at, created_by, updated_at, updated_by
		FROM "user"
		WHERE username = $1 AND deleted = false
	`
	user := &model.User{}
	err := r.db.QueryRow(query, username).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Deleted,
		&user.CreatedAt,
		&user.CreatedBy,
		&user.UpdatedAt,
		&user.UpdatedBy,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	return user, err
}

func (r *userRepository) FindByEmail(email string) (*model.User, error) {
	query := `
		SELECT id, username, email, password, deleted, created_at, created_by, updated_at, updated_by
		FROM "user"
		WHERE email = $1 AND deleted = false
	`
	user := &model.User{}
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.Deleted,
		&user.CreatedAt,
		&user.CreatedBy,
		&user.UpdatedAt,
		&user.UpdatedBy,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	return user, err
}

func (r *userRepository) Update(user *model.User) error {
	query := `
		UPDATE "user"
		SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP, updated_by = $3
		WHERE id = $4 AND deleted = false
	`
	result, err := r.db.Exec(query, user.Username, user.Email, user.UpdatedBy, user.ID)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("user not found")
	}
	return nil
}

func (r *userRepository) Delete(id int) error {
	query := `
		UPDATE "user"
		SET deleted = true, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("user not found")
	}
	return nil
}
