package operations

import (
	"log"
	"os"

	"github.com/fvbock/endless"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/form"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/question"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/responses"
	"github.com/siddhant-deshmukh/google-form-clone-gin-postgres/user"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Initialize(port string, db_dsn_env_name string) (*gin.Engine, *gorm.DB) {
	router := gin.Default()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Unable to get Postgresql data source name (DSN)")
	}
	dsn := os.Getenv(db_dsn_env_name)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	/**
	, &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}
	*/
	if err != nil {
		log.Fatal("Unable to connect to database")
	}

	SetUpDB(db)
	SetUpRoutes(router)

	// router.Run("localhost:" + port)
	return router, db
}
func CloseRouter(router *gin.Engine, port string) {
	endless.ListenAndServe(":"+port, router)
}

func SetUpDB(db *gorm.DB) {
	user.SetUserTable(db)
	question.SetQuestionTable(db)
	form.SetFormTable(db)
	responses.SetResponseTable(db)
}

func SetUpRoutes(router *gin.Engine) {

	userAuthRoutesGroup := router.Group("/")
	user.RegisterUserAuthRoutes(userAuthRoutesGroup)

	userRoutesGroup := router.Group("/u")
	userRoutesGroup.Use(user.AuthUserMiddleWare())
	user.RegisterUserRoutes(userRoutesGroup)

	formRoutesGroup := router.Group("/f")
	formRoutesGroup.Use(user.AuthUserMiddleWare())
	form.RegisterFormRoutes(formRoutesGroup)

	questionRoutesGroup := router.Group("/q")
	questionRoutesGroup.Use(user.AuthUserMiddleWare())
	question.RegisterQuestionRoutes(questionRoutesGroup)

	resRoutesGroup := router.Group("/r")
	resRoutesGroup.Use(user.AuthUserMiddleWare())
	responses.RegisterResponseRoutes(resRoutesGroup)
}
