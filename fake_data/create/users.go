package create

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"

	"github.com/brianvoe/gofakeit/v6"
	"golang.org/x/crypto/bcrypt"
)

func CreateUsersData() {
	file, err := os.Create("./data/users.csv")
	if err != nil {
		log.Fatal(err.Error() + "\nerror while create file ./data/users.csv")
	}
	defer file.Close()

	writer := csv.NewWriter(file)

	count := 0
	users := make([]int, 30)
	var bytes []byte
	bytes, err = bcrypt.GenerateFromPassword([]byte("password"), 14)
	if err != nil {
		log.Fatal(err.Error() + "\nerror encrypting password")
	}

	password := string(bytes)

	defer writer.Flush()
	writer.Write([]string{"id", "name", "email", "password"})
	for i := 0; i < 30; i++ {
		count += int(rand.Float32()*4 + 1)
		users[i] = count
		writer.Write([]string{strconv.Itoa(count), gofakeit.Name(), gofakeit.Email(), password})
	}

	jsonData, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		panic(err)
	}

	// Write the JSON data to a file
	err = os.WriteFile("data/json/users.json", jsonData, 0644)
	if err != nil {
		panic(err)
	}

	fmt.Println("Check the users.csv file and the users.json file")
}
