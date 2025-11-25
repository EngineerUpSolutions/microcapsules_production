package services

import (
	"bytes"
	"net/http"
	"time"

	"microcapsules-backend/internal/utils"
)

func CallTopicsAPI(jsonBody []byte) (*http.Response, error) {
	url := "http://10.217.78.120:8000/api/v1/temas/generar"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		utils.Logger.Printf("Failed to create Topics request: %v", err)
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		utils.Logger.Printf("Topics API call error: %v", err)
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		utils.Logger.Printf("Topics API returned non-200 status: %d", resp.StatusCode)
	}

	return resp, nil
}
