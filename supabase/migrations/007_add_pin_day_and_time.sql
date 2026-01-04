-- Add day and time columns to pins table
ALTER TABLE pins
ADD COLUMN IF NOT EXISTS day INTEGER,
ADD COLUMN IF NOT EXISTS time TIME;

-- Add check constraint to ensure day is positive
ALTER TABLE pins
ADD CONSTRAINT pins_day_check CHECK (day IS NULL OR day > 0);

