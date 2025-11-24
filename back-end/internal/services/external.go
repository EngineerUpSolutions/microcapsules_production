package services

import (
	"bytes"
	"net/http"
)

func CallExternalEndpoint1(jsonBody []byte) (*http.Response, error) {
	url := "https://example.com/api/endpoint1" // Replace with real URL

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
