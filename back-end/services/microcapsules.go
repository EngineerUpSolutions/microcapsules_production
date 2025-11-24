package services

import (
	"bytes"
	"net/http"
)

func CallMicrocapsulesAPI(jsonBody []byte) (*http.Response, error) {
	url := "http://10.217.78.120:8000/api/v1/microcapsulas/generar"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	return client.Do(req)
}
