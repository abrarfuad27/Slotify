#!/bin/bash

# Check if the database file exists
if [ ! -f "slotify.db" ]; then
  echo "Database file does not exist. Creating and initializing tables..."
  sqlite3 slotify.db < createTables.sql
else
  echo "Database file exists. Skipping table creation."
fi
