package utils

import (
	"log"
	"os"
	"time"

	"github.com/lestrrat-go/file-rotatelogs"
	"github.com/pkg/errors"
)

var Logger *log.Logger

func InitLogger() error {
	// Set timezone to Bogotá
	loc, err := time.LoadLocation("America/Bogota")
	if err != nil {
		return errors.Wrap(err, "failed to load Bogotá timezone")
	}
	time.Local = loc

	// Create log directory if needed
	if _, err := os.Stat("/app/logs"); os.IsNotExist(err) {
		err := os.MkdirAll("/app/logs", os.ModePerm)
		if err != nil {
			return errors.Wrap(err, "failed to create log directory")
		}
	}

	writer, err := rotatelogs.New(
		"/app/logs/app-log-%Y-%m-%d.log",
		rotatelogs.WithRotationTime(24*time.Hour),     // Rotate daily
		rotatelogs.WithMaxAge(7*24*time.Hour),         // Keep 7 days of logs
		rotatelogs.WithRotationCount(7),               // Max 7 files
	)
	if err != nil {
		return errors.Wrap(err, "failed to create log writer")
	}

	Logger = log.New(writer, "", log.LstdFlags)
	return nil
}
