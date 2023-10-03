package test

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/operations"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/user"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/utils"
)

func GetTokenString(ID string) (string, error) {
	token_key := utils.GetTokenKey()
	signing_key := []byte(token_key)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 24).Unix(),
		"_id": ID,
	})

	tokenString, err := token.SignedString(signing_key)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func CreateUserForTesting(user_json []byte, router *gin.Engine, port string, t *testing.T, msg string) (string, error) {
	req, _ := http.NewRequest("POST", "http://localhost:"+port+"/", bytes.NewBuffer(user_json))
	req.Header.Set("Content-Type", "application/json")
	response := operations.ExecuteRequest(req, router)
	if http.StatusCreated != response.Code {
		t.Errorf("while creating user " + msg)
		return "", errors.New("While creating user " + msg)
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}
	var auth_res authResponse
	if err := json.Unmarshal(body, &auth_res); err != nil {
		return "", err
	}
	// fmt.Println("\n body :", string(body), "\n ")
	// fmt.Println("\n user :", auth_res.User, "\n ")

	token, err := GetTokenString(strconv.Itoa(int(auth_res.User.ID)))
	fmt.Println("\n token :", token, "\n ")

	if err != nil {
		return "", err
	}
	return token, nil
}

func SendRequestAndCheckOutput(expected_code int, json []byte, url string, router *gin.Engine, t *testing.T) {
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")

	response := operations.ExecuteRequest(req, router)
	// operations.CheckResponseCode(t, expected_code, response.Code)
	if expected_code != response.Code {
		t.Errorf("for test case : \n"+string(json)+"\nExpected is %d and but got %d", expected_code, response.Code)
	}
}

func SendRequestAndCheckOutputWithToken(token string, expected_code int, json []byte, url string, router *gin.Engine, t *testing.T, reqType string) {
	req, _ := http.NewRequest(reqType, url, bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")
	cookie := &http.Cookie{
		Name:  "gf_clone_auth_token",
		Value: token,
	}
	req.AddCookie(cookie)

	response := operations.ExecuteRequest(req, router)
	// operations.CheckResponseCode(t, expected_code, response.Code)
	if expected_code != response.Code {
		t.Errorf("for test case : \n"+string(json)+"\nExpected is %d and but got %d", expected_code, response.Code)
	}
}

type authResponse struct {
	User user.User `json:"user"`
}
