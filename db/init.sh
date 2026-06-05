#!/bin/bash
# Database initialization script for Phase 5

echo "[v0] Applying database migrations..."

# Apply migrations using drizzle-kit push command
pnpm drizzle-kit push

if [ $? -eq 0 ]; then
  echo "[v0] Migrations applied successfully!"
  echo "[v0] Database schema is ready for the application"
else
  echo "[v0] Error: Migration failed"
  exit 1
fi
