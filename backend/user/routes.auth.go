package user

import "github.com/gin-gonic/gin"

func RegisterUserAuthRoutes(userRoutesGroup *gin.RouterGroup) {
	userRoutesGroup.POST("/", registerUser)
	userRoutesGroup.DELETE("/", logout)
	userRoutesGroup.POST("/login", userLogin)
}
