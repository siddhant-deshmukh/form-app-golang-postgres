package user

import (
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/form"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/question"
	"gorm.io/gorm"
)

var db *gorm.DB

type User struct {
	ID        uint                `json:"id"`
	Name      string              `json:"name" gorm:"type:varchar(20); not null"`
	Email     string              `json:"email" gorm:"type:varchar(100);uniqueIndex; not null;check:email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'"`
	Password  string              `json:"password" gorm:"type:varchar(100); not null"`
	Forms     []form.Form         `json:"forms" gorm:"foreignKey:AuthorID;references:ID"`
	Questions []question.Question `json:"questions" gorm:"foreignKey:AuthorID;references:ID"`
}
type UserCreateForm struct {
	Name     string `json:"name" validate:"max=20,min=2,required"`
	Email    string `json:"email" validate:"email,required,max=100" `
	Password string `json:"password" validate:"max=20,min=5,required"`
}
type UserLoginForm struct {
	Email    string `json:"email" validate:"email,required"`
	Password string `json:"password" validate:"required"`
}
type UserResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func SetUserTable(gormDB *gorm.DB) {
	db = gormDB
	db.AutoMigrate(&User{})
}
