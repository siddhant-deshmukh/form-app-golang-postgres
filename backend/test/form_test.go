package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/form"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/operations"
)

var user_create_to_test_form = []byte(`{"name":"Siddhant", "email":"meow@gmail.com", "password":"password"}`) // new user to create to test login

func TestForm(t *testing.T) {
	port := "8090"
	url := "http://localhost:" + port + "/f/"
	db_dsn_env_name := "TEST_DATA_SOURCE_NAME"
	router, db := operations.Initialize(port, db_dsn_env_name)
	go router.Run("localhost:" + port)

	operations.ClearTables(db)
	// defer operations.ClearTables(db)

	var auth_token string
	if token, err := CreateUserForTesting(user_create_to_test_form, router, port, t, "to test login"); err != nil {
		return
	} else {
		auth_token = token
	}
	fmt.Println("\n\n auth_token : \t", auth_token, "\n ")

	for _, test_case := range create_form_test_cases {
		SendRequestAndCheckOutputWithToken(auth_token, test_case.expected_code, test_case.json, url, router, t, "POST")
	}

	for _, test_case := range edit_form_test_cases {
		bytes, err := json.Marshal(test_case.NewForm)
		if err != nil {
			t.Errorf("While converting form into json \n\t" + string(bytes) + "\n\t" + err.Error() + "\n ")
			continue
		}
		new_form, err := CreateFormForTesting(auth_token, http.StatusCreated, bytes, url, router, t)
		if err != nil {
			t.Errorf("Error while creating form for testing \n\t" + string(bytes) + "\n" + err.Error() + "\n ")
			continue
		}
		bytes_e, err := json.Marshal(test_case.EditForm)
		if err != nil {
			t.Errorf("While converting form (editing) into json \n\t" + string(bytes) + "\n\t" + err.Error() + "\n ")
			continue
		}
		SendRequestAndCheckOutputWithToken(auth_token, test_case.ExpectedCode, bytes_e, url+strconv.Itoa(int(new_form.ID)), router, t, "PUT")
	}
}

var create_form_test_cases = []testCases{
	// {
	// 	json:          []byte(`{}`), //! Invalid title
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json:          []byte(`{"title":""}`), //! Invalid title
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json:          []byte(`{"title":"12345"}`), //! Invalid title
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json:          []byte(`{"title":"A"}`), //! Invalid title
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json:          []byte(`{"title":"12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901"}`), //! Invalid title
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json:          []byte(`{"title":"1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"}`), //* Valid title
	// 	expected_code: http.StatusCreated,
	// },
	// {
	// 	json:          []byte(`{"title":"123456"}`), //* Valid title
	// 	expected_code: http.StatusCreated,
	// },
	// {
	// 	json:          []byte(`{"title":"123456", "description":"Something"}`), //* Valid
	// 	expected_code: http.StatusCreated,
	// },
	// {
	// 	json: []byte(`{
	// 		"title":"123456",
	// 		"description":"Just for testing",
	// 		"quiz_setting": {
	// 			"is_quiz" : true,
	// 			"default_points" : 5
	// 		},
	// 		"response_setting" : {
	// 			"collect_email" : true,
	// 			"allow_edit_res": true,
	// 			"send_res_copy" : true
	// 		}
	// 	}`), //* Valid title
	// 	expected_code: http.StatusCreated,
	// },
	// {
	// 	json: []byte(`{
	// 		"title":"12345",
	// 		"description":"Just for testing",
	// 		"quiz_setting": {
	// 			"is_quiz" : true,
	// 			"default_points" : 0
	// 		},
	// 		"response_settings" : {
	// 			"send_res_copy" : true,
	// 		}
	// 	}`), //! Invalid default points
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json: []byte(`{
	// 		"title":"12345",
	// 		"description":"Just for testing",
	// 		"quiz_setting": {
	// 			"is_quiz" : "meow",
	// 			"default_points" : 0
	// 		},
	// 		"response_settings" : {
	// 			"send_res_copy" : true,
	// 		}
	// 	}`), //! Invalid is_quiz and default points
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json: []byte(`{
	// 		"title":"123456",
	// 		"description":"Just for testing",
	// 		"quiz_setting": {
	// 		},
	// 		"response_setting" : {
	// 			"send_res_copy" : false
	// 		}
	// 	}`), //! Invalid quiz setting
	// 	expected_code: http.StatusBadRequest,
	// },
	// {
	// 	json: []byte(`{
	// 		"title":"123456",
	// 		"description":"Just for testing",
	// 		"quiz_setting": {
	// 			"is_quiz" : true,
	// 			"default_points" : 5
	// 		}
	// 	}`), //* Valid title
	// 	expected_code: http.StatusCreated,
	// },
	// {
	// 	json: []byte(`{
	// 		"title":"123456",
	// 		"response_setting" : {
	// 			"collect_email" : true,
	// 			"allow_edit_res": true,
	// 			"send_res_copy" : true
	// 		}
	// 	}`), //* Valid title
	// 	expected_code: http.StatusCreated,
	// },
}

var edit_form_test_cases = []editFormTestCases{
	{
		NewForm: form.NewForm{
			Title: "Something amazing!",
		},
		EditForm: form.EditForm{
			Quiz_Setting: &form.Edit_Quiz_Setting{
				IsQuiz:        false,
				DefaultPoints: 5,
			},
		},
		ExpectedCode: http.StatusOK,
	},
	{
		NewForm: form.NewForm{
			Title: "Something!",
		},
		EditForm: form.EditForm{
			Quiz_Setting: &form.Edit_Quiz_Setting{
				IsQuiz: false,
			},
		}, //! By default the default points will be assigned to 0 which is not allowed
		ExpectedCode: http.StatusBadRequest,
	},
	{
		NewForm: form.NewForm{
			Title: "Something amazing!",
		},
		EditForm: form.EditForm{
			Response_Setting: &form.Edit_Response_Setting{
				CollectEmail: false,
			},
		},
		ExpectedCode: http.StatusOK,
	},
}

func CreateFormForTesting(token string, expected_code int, new_form []byte, url string, router *gin.Engine, t *testing.T) (form.Form, error) {
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(new_form))
	req.Header.Set("Content-Type", "application/json")
	cookie := &http.Cookie{
		Name:  "gf_clone_auth_token",
		Value: token,
	}
	req.AddCookie(cookie)

	response := operations.ExecuteRequest(req, router)
	// operations.CheckResponseCode(t, expected_code, response.Code)
	if expected_code != response.Code {
		t.Errorf("for test case : \n"+string(new_form)+"\nExpected is %d and but got %d", expected_code, response.Code)
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return form.Form{}, err
	}
	var form_res createFormRes
	if err := json.Unmarshal(body, &form_res); err != nil {
		return form.Form{}, err
	}

	return form_res.Form, nil
}

type editFormTestCases struct {
	NewForm      form.NewForm
	EditForm     form.EditForm
	ExpectedCode int
}

type createFormRes struct {
	Form form.Form
}
