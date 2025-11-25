package services
import (
	"bytes"
	"io"
	"net/http"
	"time"
	"microcapsules-backend/internal/utils"
)
func CallMicrocapsulesAPI(jsonBody []byte) (*http.Response, error) {
	url := "http://10.217.78.120:8000/api/v1/microcapsulas/generar"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		utils.Logger.Printf("ERROR creating microcapsules request: %v", err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		utils.Logger.Printf("TIMEOUT or CONNECTION ERROR calling microcapsules API: %v", err)
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		defer resp.Body.Close()
		utils.Logger.Printf("ERROR: microcapsules API returned status %d - Response: %s", resp.StatusCode, string(body))
	}
	return resp, nil
}
