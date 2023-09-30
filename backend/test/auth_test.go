package test

import (
	"bytes"
	"fmt"
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/operations"
)

func TestRegister(t *testing.T) {

	port := "8090"
	url := "http://localhost:" + port + "/"
	db_dsn_env_name := "TEST_DATA_SOURCE_NAME"
	router, db := operations.Initialize(port, db_dsn_env_name)
	go router.Run("localhost:" + port)

	fmt.Println("\n\n", "\t\t Here after \n\n ")
	operations.ClearTables(db)

	// normal_json := []byte(`{"name":"Siddhant", "email":"meow@gmail.com", "password":"password"}`)

	test_cases := []testCase{
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow@gmail.com", "password":"password"}`), //* Valid User
			expected_code: http.StatusCreated,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"m@g.c", "password":"password"}`), //* Valid User
			expected_code: http.StatusCreated,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow@gmail.com", "password":"password"}`), //! Dubplicate Email
			expected_code: http.StatusConflict,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow1gmail.com", "password":"password"}`), //! Invalid Email
			expected_code: http.StatusBadRequest,
		},
		{
			json:          []byte(`{"name":"Siddhant", "password":"password"}`), //! Invalid Email
			expected_code: http.StatusBadRequest,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow1@gmail", "password":"password"}`), //! Invalid Email
			expected_code: http.StatusBadRequest,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow1gmail@.", "password":"password"}`), //! Invalid Email
			expected_code: http.StatusBadRequest,
		},

		{
			json:          []byte(`{"name":"12", "email":"cat1@gmail.com", "password":"password"}`), //* Valid User Name
			expected_code: http.StatusCreated,
		},
		{
			json:          []byte(`{"name":"12345678901234567890", "email":"cat2@gmail.com", "password":"password"}`), //* Valid User Name
			expected_code: http.StatusCreated,
		},
		{
			json:          []byte(`{"email":"cat3@gmail.com", "password":"password"}`), //! Invalid Name
			expected_code: http.StatusBadRequest,
		},
		{
			json:          []byte(`{"name" : "", "email":"cat4@gmail.com", "password":"password"}`), //! Invalid Name
			expected_code: http.StatusBadRequest,
		},
		{
			json:          []byte(`{"name" : "1", "email":"cat5@gmail.com", "password":"password"}`), //! Invalid Name
			expected_code: http.StatusBadRequest,
		},
		{
			json:          []byte(`{"name" : "123456789012345678901", "email":"meow2@gmail.com", "password":"password"}`), //! Invalid Name
			expected_code: http.StatusBadRequest,
		},

		{
			json:          []byte(`{"name":"Siddhant", "email":"meow1@gmail.com", "password":"passw"}`), //* Valid User
			expected_code: http.StatusCreated,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow2@gmail.com", "password":"12345678901234567890"}`), //* Valid User
			expected_code: http.StatusCreated,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow3@gmail.com", "password":"pass"}`), //! Invalid Password length < 5
			expected_code: http.StatusBadRequest,
		},
		{
			json:          []byte(`{"name":"Siddhant", "email":"meow4@gmail.com", "password":"123456789012345678901"}`), //! Invalid Password length > 20
			expected_code: http.StatusBadRequest,
		},
	}

	for _, test_case := range test_cases {
		checkTestRegsiter(test_case.expected_code, test_case.json, url, router, t)
	}

	defer operations.ClearTables(db)
	// defer operations.CloseRouter(router, port)
}

func checkTestRegsiter(expected_code int, json []byte, url string, router *gin.Engine, t *testing.T) {
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")

	response := operations.ExecuteRequest(req, router)
	// operations.CheckResponseCode(t, expected_code, response.Code)
	if expected_code != response.Code {
		t.Errorf("for test case : \n"+string(json)+"\nExpected is %d and but got %d", expected_code, response.Code)
	}
}

type testCase struct {
	json          []byte
	expected_code int
}
