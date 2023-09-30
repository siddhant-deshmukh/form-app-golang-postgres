package test

import (
	"bytes"
	"fmt"
	"net/http"
	"testing"

	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/operations"
)

func TestRegister2(t *testing.T) {

	port := "8090"
	url := "http://localhost:" + port + "/"
	db_dsn_env_name := "TEST_DATA_SOURCE_NAME"
	router, db := operations.Initialize(port, db_dsn_env_name)

	fmt.Println("\n\n", "\t\t Here after \n\n ")
	operations.ClearTables(db)

	json := []byte(`{"name":"Siddhant", "email":"meow@gmail.com", "password":"password"}`)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")

	response := operations.ExecuteRequest(req, router)
	operations.CheckResponseCode(t, http.StatusCreated, response.Code)

	defer operations.ClearTables(db)
	defer operations.CloseRouter(router, port)

}
