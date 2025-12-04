-- Add benefit_type_changed to operation_type enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'benefit_type_changed' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'operation_type')
  ) THEN
    ALTER TYPE operation_type ADD VALUE 'benefit_type_changed';
  END IF;
END $$;

