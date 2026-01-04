-- Add Google Places data columns to pins table
ALTER TABLE pins
ADD COLUMN IF NOT EXISTS place_id TEXT,
ADD COLUMN IF NOT EXISTS place_data JSONB;

-- Add index for place_id lookups
CREATE INDEX IF NOT EXISTS idx_pins_place_id ON pins(place_id) WHERE place_id IS NOT NULL;

