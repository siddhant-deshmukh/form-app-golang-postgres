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
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/form"
)

func CreateFormsData() {
	users_json, err := os.ReadFile("./data/json/users.json")
	if err != nil {
		panic(err)
	}

	var users []int
	if err := json.Unmarshal(users_json, &users); err != nil {
		panic(err)
	}

	file, err := os.Create("./data/forms.csv")
	if err != nil {
		log.Fatal(err.Error() + "\nerror while create file ./data/users.csv")
	}
	defer file.Close()

	writer := csv.NewWriter(file)

	count := 0
	forms_json := struct {
		ids   []int
		forms map[int]int
	}{
		ids:   make([]int, 50),
		forms: make(map[int]int),
	}

	defer writer.Flush()
	// writer.Write([]string{"id", "author_id", "title", "description", "quiz_setting", "response_setting"})
	for i := 0; i < 1; i++ {
		count += int(rand.Float32()*4 + 1)
		author_id := users[int(rand.Float32()*float32(len(users)-1))]
		title := gofakeit.LoremIpsumSentence(5)
		description := gofakeit.LoremIpsumSentence(10)

		var quiz_setting, response_setting string
		if false {
			quiz_setting = ""
		} else {
			if byte, err := json.Marshal(form.Quiz_Setting{IsQuiz: gofakeit.Bool(), DefaultPoints: gofakeit.UintRange(1, 50)}); err != nil {
				fmt.Println("\n quiz_setting:", err.Error(), " \n ")
			} else {
				quiz_setting = string(byte)
			}
		}
		if false {
			response_setting = ""
		} else {
			if byte, err := json.Marshal(form.Response_Setting{CollectEmail: gofakeit.Bool(), AllowEditRes: gofakeit.Bool(), SendResCopy: gofakeit.Bool()}); err != nil {
				fmt.Println("\n response_setting:", err.Error(), " \n ")
			} else {
				response_setting = string(byte)
			}
		}

		forms_json.ids[i] = count
		writer.Write([]string{strconv.Itoa(count), strconv.Itoa(author_id), title, description, quiz_setting, response_setting})
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
