-- Add start_date, end_date, and label columns to trips table
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS label TEXT;

-- Add check constraint to ensure end_date is after start_date
ALTER TABLE trips
ADD CONSTRAINT trips_date_check CHECK (
  start_date IS NULL OR end_date IS NULL OR end_date >= start_date
);

