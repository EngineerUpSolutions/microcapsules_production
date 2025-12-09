package subscriptions

import (
	"database/sql"
	"fmt"
	"time"
)

// Repository handles access to mdl_local_microcapsulas_subs.
type Repository struct {
	db        *sql.DB
	tableName string
}

func NewRepository(db *sql.DB, prefix string) *Repository {
	return &Repository{
		db:        db,
		tableName: fmt.Sprintf("%slocal_microcapsulas_subs", prefix),
	}
}

type Subscription struct {
	UserID     int64
	CourseID   int64
	Subscribed bool
}

// GetByUser returns all subscriptions rows for a given user.
// NOTE: the backend logic will treat "no rows" as "subscribed by default".
func (r *Repository) GetByUser(userID int64) ([]Subscription, error) {
	query := fmt.Sprintf(
		"SELECT userid, courseid, subscribed FROM %s WHERE userid = $1",
		r.tableName,
	)

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subs []Subscription
	for rows.Next() {
		var s Subscription
		if err := rows.Scan(&s.UserID, &s.CourseID, &s.Subscribed); err != nil {
			return nil, err
		}
		subs = append(subs, s)
	}
	return subs, rows.Err()
}

// Upsert sets the "subscribed" flag for (userID, courseID).
// It is safe for concurrent usage because sql.DB manages its own pool.
func (r *Repository) Upsert(userID, courseID int64, subscribed bool) error {
	now := time.Now().Unix()

	query := fmt.Sprintf(`
INSERT INTO %s (userid, courseid, subscribed, timecreated, timemodified)
VALUES ($1, $2, $3, $4, $4)
ON CONFLICT (userid, courseid)
DO UPDATE SET
  subscribed = EXCLUDED.subscribed,
  timemodified = EXCLUDED.timemodified;
`, r.tableName)

	_, err := r.db.Exec(query, userID, courseID, subscribed, now)
	return err
}

