package main

import (
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/operations"
)

func main() {
	port := "8080"
	db_dsn_env_name := "PG_DATA_SOURCE_NAME"
	router, _ := operations.Initialize(port, db_dsn_env_name)
	router.Run("localhost:" + port)
}
