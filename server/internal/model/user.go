package model

import "time"

type User struct {
	ID        int        `json:"id"`
	Username  string     `json:"username"`
	Email     *string    `json:"email,omitempty"`     // OAuth認証時はNULLの可能性あり
	Password  *string    `json:"-"`                   // JSONには含めない、OAuth認証時はNULL
	GoogleID  *string    `json:"google_id,omitempty"` // Google OAuthのユーザーID
	Deleted   bool       `json:"deleted"`
	CreatedAt time.Time  `json:"created_at"`
	CreatedBy *string    `json:"created_by,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
	UpdatedBy *string    `json:"updated_by,omitempty"`
}
