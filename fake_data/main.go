package main

import (
	"fake_data/create"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Unable to load .env file")
	}
	// dsn := os.Getenv("PG_DATA_SOURCE_NAME")
	create.CreateUsersData()
	create.CreateFormsData()
	// form.add()
}

// func GetTokenKey() string {
// 	err := godotenv.Load()
// 	if err != nil {
// 		log.Fatal("Unable to get token Key")
// 	}

// 	token_key := os.Getenv("TOKEN_KEY")
// 	if token_key == "" {
// 		log.Fatal("Please add TOKEN_KEY in .env")
// 	}
// 	return token_key
// }
