package services

import (
	"net"
	"net/http"
	"time"
)

var (
	SharedClient = &http.Client{ 
		Timeout: 15 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxIdleConnsPerHost: 100,
			IdleConnTimeout:     90 * time.Second,
			DialContext: (&net.Dialer{
				Timeout:   10 * time.Second,
				KeepAlive: 30 * time.Second,
			}).DialContext,
		},
	}

	Semaphore = make(chan struct{}, 20) 
)
