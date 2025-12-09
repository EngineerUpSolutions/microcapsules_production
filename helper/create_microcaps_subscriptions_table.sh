#!/usr/bin/env bash
set -euo pipefail

# ==============================
# Default DB config (can be overridden with env vars)
# ==============================

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-zajuna}"     # your DB name
DB_USER="${DB_USER:-postgres}"   # your DB user
DB_PREFIX="${DB_PREFIX:-mdl_}"   # Moodle table prefix (usually mdl_)

# IMPORTANT: we never hardcode the password here.
DB_PASSWORD="${DB_PASSWORD:-}"

if [[ -z "${DB_PASSWORD}" ]]; then
  echo "ERROR: DB_PASSWORD is not set. Run the script like:"
  echo "  DB_PASSWORD='your_password_here' ./helper/create_microcaps_subscriptions_table.sh"
  exit 1
fi

TABLE_NAME="${DB_PREFIX}local_microcapsulas_subs"

# ==============================
# DDL for the distribution list table
# ==============================
# Semantics:
# - One row per (userid, courseid)
# - 'subscribed' = TRUE or FALSE
# - Backend will treat \"no row\" as SUBSCRIBED by default.
#   This means: by default, all courses are considered subscribed
#   until the user explicitly changes them.

SQL="
CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id BIGSERIAL PRIMARY KEY,
    userid BIGINT NOT NULL,
    courseid BIGINT NOT NULL,
    subscribed BOOLEAN NOT NULL DEFAULT TRUE,
    timecreated BIGINT NOT NULL,
    timemodified BIGINT NOT NULL,
    CONSTRAINT ${TABLE_NAME}_user_fk FOREIGN KEY (userid)
        REFERENCES ${DB_PREFIX}user(id) ON DELETE CASCADE,
    CONSTRAINT ${TABLE_NAME}_course_fk FOREIGN KEY (courseid)
        REFERENCES ${DB_PREFIX}course(id) ON DELETE CASCADE,
    CONSTRAINT ${TABLE_NAME}_user_course_uk UNIQUE (userid, courseid)
);

CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_course_idx
    ON ${TABLE_NAME} (courseid);
"

echo "Creating table ${TABLE_NAME} in database ${DB_NAME} on ${DB_HOST}:${DB_PORT}..."

export PGPASSWORD="${DB_PASSWORD}"

psql \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  -v ON_ERROR_STOP=1 <<EOF
${SQL}
EOF

unset PGPASSWORD

echo "Done. Table ${TABLE_NAME} is ready."
