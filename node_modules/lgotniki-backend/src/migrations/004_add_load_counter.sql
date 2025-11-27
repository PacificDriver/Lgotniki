-- Add load_counter field to beneficiaries table for BY_LOAD_COUNTER mode
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS load_counter INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN beneficiaries.load_counter IS 'Счетчик пропущенных загрузок для режима by_load_counter';

