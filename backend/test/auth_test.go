package test

import (
	"net/http"
	"testing"

	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/operations"
)

func TestRegister(t *testing.T) {

	port := "8090"
	url := "http://localhost:" + port + "/"
	db_dsn_env_name := "TEST_DATA_SOURCE_NAME"
	router, db := operations.Initialize(port, db_dsn_env_name)
	go router.Run("localhost:" + port)

	operations.ClearTables(db)

	for _, test_case := range register_test_cases {
		SendRequestAndCheckOutput(test_case.expected_code, test_case.json, url, router, t)
	}

	defer operations.ClearTables(db)
	// defer operations.CloseRouter(router, port)
}

func TestLogin(t *testing.T) {

	port := "8090"
	url := "http://localhost:" + port + "/login"
	db_dsn_env_name := "TEST_DATA_SOURCE_NAME"
	router, db := operations.Initialize(port, db_dsn_env_name)
	go router.Run("localhost:" + port)

	operations.ClearTables(db)
	defer operations.ClearTables(db)

	if _, err := CreateUserForTesting(user_create_to_test_login, router, port, t, "to test login"); err != nil {
		return
	}

	for _, test_case := range login_test_cases {
		SendRequestAndCheckOutput(test_case.expected_code, test_case.json, url, router, t)
	}
}

var user_create_to_test_login = []byte(`{"name":"Siddhant", "email":"meow@gmail.com", "password":"password"}`) // new user to create to test login
var login_test_cases = []testCases{
	{
		json:          []byte(`{"name":"Siddhant", "email":"meow@gmail.com", "password":"password"}`), //* Valid User credentials
		expected_code: http.StatusOK,
	},
	{
		json:          []byte(`{"email":"meow@gmail.com", "password":"password"}`), //* Valid User credentials
		expected_code: http.StatusOK,
	},
	{
		json:          []byte(`{"email":"meow2@gmail.com", "password":"password"}`), //! Wrong email
		expected_code: http.StatusNotFound,
	},
	{
		json:          []byte(`{"email":"meow@gmail.com", "password":"passwordd"}`), //! Wrong password
		expected_code: http.StatusConflict,
	},
}

var register_test_cases = []testCases{
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

type testCases struct {
	json          []byte
	expected_code int
}
