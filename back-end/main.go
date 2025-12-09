package main
import (
	"fmt"
	"log"

	"microcapsules-backend/handlers"
	"microcapsules-backend/internal/db"
	"microcapsules-backend/internal/subscriptions"
	"microcapsules-backend/internal/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize custom logger
	if err := utils.InitLogger(); err != nil {
		log.Fatalf("Logger initialization failed: %v", err)
	}
	//subscription handling
		// ---- DB config + connection for subscriptions ----
	cfg := db.LoadConfig()
	dbConn, err := db.Open(cfg)
	if err != nil {
		log.Fatalf("DB connection failed: %v", err)
	}
	defer dbConn.Close()

	// Repository + handler for distribution subscriptions
	subRepo := subscriptions.NewRepository(dbConn, cfg.Prefix)
	subHandler := handlers.NewSubscriptionHandler(subRepo)
	// ---------------------------------------------------

	// Set Gin to release mode for production
	gin.SetMode(gin.ReleaseMode)
	// Create new Gin router
	r := gin.Default()
	// Set trusted proxies to nil (security practice)
	if err := r.SetTrustedProxies(nil); err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}
	// Health-check endpoints (optional but useful for monitoring)
	r.GET("/endpoint1", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from endpoint 1"})
	})
	r.GET("/endpoint2", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello from endpoint 2"})
	})
	// Core proxy routes
	r.POST("/proxy/topics", handlers.TopicsHandler)
	r.POST("/proxy/microcapsules", handlers.MicrocapsulesHandler)

	subHandler.RegisterRoutes(r)
	
	fmt.Println("Server is starting on port 8080...")
	// Start the server
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
