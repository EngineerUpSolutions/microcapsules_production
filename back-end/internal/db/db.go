package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Config struct {
	Host     string
	Port     string
	Name     string
	User     string
	Password string
	Prefix   string
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func LoadConfig() Config {
	return Config{
		Host:     getenv("DB_HOST", "127.0.0.1"),
		Port:     getenv("DB_PORT", "5432"),
		Name:     getenv("DB_NAME", "zajuna"),
		User:     getenv("DB_USER", "postgres"),
		Password: getenv("DB_PASSWORD", ""),
		Prefix:   getenv("DB_PREFIX", "mdl_"),
	}
}

func Open(cfg Config) (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=disable",
		cfg.Host, cfg.Port, cfg.Name, cfg.User, cfg.Password,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Connected to Postgres:", cfg.Host, cfg.Name)
	return db, nil
}

