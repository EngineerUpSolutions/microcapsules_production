package handlers

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"microcapsules-backend/services"
)

func TopicsHandler(c *gin.Context) {
	bodyBytes, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	resp, err := services.CallTopicsAPI(bodyBytes)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Failed to reach external topics API"})
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read external response"})
		return
	}

	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), respBody)
}
