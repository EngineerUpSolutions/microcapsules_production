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

	// Ensure log directory exists
	if _, err := os.Stat("/app/logs"); os.IsNotExist(err) {
		if err := os.MkdirAll("/app/logs", os.ModePerm); err != nil {
			return errors.Wrap(err, "failed to create log directory")
		}
	}

	writer, err := rotatelogs.New(
		"/app/logs/app-log-%Y-%m-%d.log",
		rotatelogs.WithRotationTime(24*time.Hour), // Rotate daily
		rotatelogs.WithRotationCount(7),           // Keep last 7 logs
	)
	if err != nil {
		return errors.Wrap(err, "failed to create log writer")
	}

	Logger = log.New(writer, "", log.LstdFlags)
	return nil
}
