package operations

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/form"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/question"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/responses"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/user"
	"gorm.io/gorm"
)

func ExecuteRequest(req *http.Request, router *gin.Engine) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	return rr
}

func CheckResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected is %d and the acutall is %d", expected, actual)
	}
}

func ClearTables(db *gorm.DB) {
	db.Where("id >= 0").Delete(&responses.Response{})
	db.Where("id >= 0").Delete(&question.Question{})
	db.Where("id >= 0").Delete(&question.QueSeq{})
	db.Where("id >= 0").Delete(&form.Form{})
	db.Where("id >= 0").Delete(&user.User{})
}
