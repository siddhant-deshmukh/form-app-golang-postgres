package user

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/mitchellh/mapstructure"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/utils"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var token_key = utils.GetTokenKey()

func userLogin(c *gin.Context) {
	var userData UserLoginForm
	var user User

	err := c.BindJSON(&userData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "enter user data in correct form",
			"err":     err.Error(),
		})
		return
	}

	if res_msg, err := utils.ValidateFieldWithStruct(userData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": res_msg,
			"err":     err.Error(),
		})
		return
	}

	result := db.Find(&User{}).Where("email = ?", userData.Email).First(&user)
	if result.Error == gorm.ErrRecordNotFound || result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Email not found",
			"err":     result.Error.Error(),
		})
		return
	}
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Some error occured",
			"err":     result.Error.Error(),
		})
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userData.Password))
	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Enter correct credentials"})
		return
	}

	err = saveTokenString(c, strconv.FormatUint(uint64(user.ID), 10))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Some error occured while creating token",
			"error":   err.Error(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"user": UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		},
	})
}

func registerUser(c *gin.Context) {
	var newUserData UserCreateForm

	err := c.BindJSON(&newUserData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "enter user data in correct form",
			"err":     err.Error(),
		})
		return
	}

	if res_msg, err := utils.ValidateFieldWithStruct(newUserData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": res_msg,
			"err":     err.Error(),
		})
		return
	}

	var bytes []byte
	bytes, err = bcrypt.GenerateFromPassword([]byte(newUserData.Password), 14)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "While hashing password"})
		return
	}
	newUserData.Password = string(bytes)

	var user User
	mapstructure.Decode(newUserData, &user)

	result := db.Create(&user)
	var duplicateKey = &pgconn.PgError{Code: "23505"}
	if errors.As(result.Error, &duplicateKey) {
		c.JSON(http.StatusConflict, gin.H{
			"message": "Email already exist",
			"err":     result.Error.Error(),
		})
		return
	}
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Some error occured",
			"err":     result.Error.Error(),
			"ee":      result.Error.Error(),
			"ee2":     gorm.ErrDuplicatedKey.Error(),
		})
		return
	}

	err = saveTokenString(c, strconv.FormatUint(uint64(user.ID), 10))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Some error occured while creating token",
			"error":   err,
		})
	}

	c.JSON(http.StatusCreated, gin.H{
		"user": UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		},
	})

	/**
	"user": map[string]any{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
	*/
}

func logout(c *gin.Context) {
	c.SetCookie("gf_clone_auth_token", "", 000, "/", "http://www.localhost:8080.com", false, true)
	c.JSON(http.StatusOK, gin.H{
		"msg": "Successfully loged out",
	})
}

func saveTokenString(c *gin.Context, ID string) error {

	// fmt.Println(ID)

	signing_key := []byte(token_key)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 24).Unix(),
		"_id": ID,
	})

	tokenString, err := token.SignedString(signing_key)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{
			"message": "While creating token",
			"err":     err,
		})
		return err
	}

	c.SetCookie("gf_clone_auth_token", tokenString, 364000, "/", "http://www.localhost:8080.com", false, true)
	return nil
}
