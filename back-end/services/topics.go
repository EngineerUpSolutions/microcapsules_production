package services

import (
	"bytes"
	"io"
	"net/http"
    "os"
	"microcapsules-backend/internal/utils"
)

func CallTopicsAPI(jsonBody []byte) (*http.Response, error) {
    url := os.Getenv("TOPICS_API_URL")
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		utils.Logger.Printf("Failed to create Topics request: %v", err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	Semaphore <- struct{}{}         // acquire slot
	defer func() { <-Semaphore }()  // release slot

	resp, err := SharedClient.Do(req)
	if err != nil {
		utils.Logger.Printf("Topics API call error: %v", err)
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		defer resp.Body.Close()
		utils.Logger.Printf("ERROR: Topics API returned status %d - Response: %s", resp.StatusCode, string(body))
	}

	return resp, nil
}
