package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"microcapsules-backend/internal/handlers" // ✅ update to match your module name
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	if err := r.SetTrustedProxies(nil); err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}

	// Existing demo endpoints (optional to keep)
	r.GET("/endpoint1", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from endpoint 1"})
	})

	r.GET("/endpoint2", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from endpoint 2"})
	})

	// ✅ New endpoint for external API proxy
	r.POST("/proxy/endpoint1", handlers.ProxyToEndpoint1)

	fmt.Println("🚀 Server is starting on port 8080...")

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
