package main

import (
	"fmt"
	"log"
	"microcapsules-backend/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	if err := r.SetTrustedProxies(nil); err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}

	r.GET("/endpoint1", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from endpoint 1"})
	})

	r.GET("/endpoint2", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from endpoint 2"})
	})

	r.POST("/proxy/topics", handlers.TopicsHandler)
	r.POST("/proxy/microcapsules", handlers.MicrocapsulesHandler)

	fmt.Println("Server is starting on port 8080...")

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
