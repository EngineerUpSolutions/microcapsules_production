package main

import (
    "fmt"
    "log"

    "github.com/gin-gonic/gin"
)

func main() {
    gin.SetMode(gin.ReleaseMode) // Run in production mode

    r := gin.Default()

    // Do not trust any proxies (safe default)
    if err := r.SetTrustedProxies(nil); err != nil {
        log.Fatalf("Failed to set trusted proxies: %v", err)
    }

    // Define endpoints
    r.GET("/endpoint1", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Hello from endpoint 1"})
    })

    r.GET("/endpoint2", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Hello from endpoint 2"})
    })

    fmt.Println("🚀 Server is starting on port 8080...")

    // Start server
    if err := r.Run(":8080"); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
