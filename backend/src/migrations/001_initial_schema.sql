-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE beneficiary_status AS ENUM ('active', 'inactive', 'archive', 'under_review', 'possibly_lost');
CREATE TYPE operation_type AS ENUM (
  'created', 'updated', 'deleted', 'loaded', 
  'benefit_assigned', 'benefit_used', 
  'card_linked', 'card_unlinked', 'status_changed'
);
CREATE TYPE benefit_calculation_type AS ENUM ('fixed_trips', 'kilometer_limit', 'discount_percent', 'free');
CREATE TYPE card_type AS ENUM ('rfid', 'nfc', 'hash_pan');
CREATE TYPE load_mode AS ENUM (
  'full_sync', 'soft_add', 'only_new', 'only_update', 
  'full_reload', 'with_archive', 'with_manual_review', 
  'with_delayed_deactivation', 'by_load_counter'
);
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');

-- Users table (for authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'operator',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Benefit types table
CREATE TABLE benefit_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  routes TEXT[], -- Array of route numbers
  settlements TEXT[], -- Array of settlement names
  time_restrictions JSONB, -- { daysOfWeek: [1,2,3], hours: { from: "08:00", to: "20:00" } }
  calculation_type benefit_calculation_type NOT NULL,
  calculation_params JSONB, -- { trips: 144, kilometers: 1000, discountPercent: 50 }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiaries table (main registry)
CREATE TABLE beneficiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  snils VARCHAR(50),
  hash_pan VARCHAR(255),
  nfc_id VARCHAR(255),
  rfid VARCHAR(255),
  benefit_type_id UUID REFERENCES benefit_types(id) ON DELETE SET NULL,
  status beneficiary_status DEFAULT 'active',
  residence VARCHAR(255),
  last_loaded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for beneficiaries
CREATE INDEX idx_beneficiaries_phone ON beneficiaries(phone);
CREATE INDEX idx_beneficiaries_snils ON beneficiaries(snils) WHERE snils IS NOT NULL;
CREATE INDEX idx_beneficiaries_hash_pan ON beneficiaries(hash_pan) WHERE hash_pan IS NOT NULL;
CREATE INDEX idx_beneficiaries_nfc_id ON beneficiaries(nfc_id) WHERE nfc_id IS NOT NULL;
CREATE INDEX idx_beneficiaries_rfid ON beneficiaries(rfid) WHERE rfid IS NOT NULL;
CREATE INDEX idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX idx_beneficiaries_benefit_type ON beneficiaries(benefit_type_id);
CREATE INDEX idx_beneficiaries_birth_date ON beneficiaries(birth_date);

-- Beneficiary operations history table
CREATE TABLE beneficiary_operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  operation_type operation_type NOT NULL,
  performed_by UUID NOT NULL REFERENCES users(id),
  performed_by_name VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_beneficiary_operations_beneficiary ON beneficiary_operations(beneficiary_id);
CREATE INDEX idx_beneficiary_operations_type ON beneficiary_operations(operation_type);
CREATE INDEX idx_beneficiary_operations_created ON beneficiary_operations(created_at);

-- Cards table (transport cards linked to beneficiaries)
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  card_type card_type NOT NULL,
  card_identifier VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unlinked_at TIMESTAMP
);

CREATE UNIQUE INDEX idx_cards_identifier ON cards(card_identifier, card_type) WHERE is_active = true;
CREATE INDEX idx_cards_beneficiary ON cards(beneficiary_id);
CREATE INDEX idx_cards_type ON cards(card_type);

-- Benefit assignments table
CREATE TABLE benefit_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  benefit_type_id UUID NOT NULL REFERENCES benefit_types(id) ON DELETE CASCADE,
  trips_remaining INTEGER,
  kilometers_remaining DECIMAL(10, 2),
  discount_percent INTEGER,
  valid_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valid_to TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_benefit_assignments_beneficiary ON benefit_assignments(beneficiary_id);
CREATE INDEX idx_benefit_assignments_benefit_type ON benefit_assignments(benefit_type_id);
CREATE INDEX idx_benefit_assignments_active ON benefit_assignments(is_active, valid_from, valid_to);

-- Benefit usage table
CREATE TABLE benefit_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  benefit_assignment_id UUID NOT NULL REFERENCES benefit_assignments(id) ON DELETE CASCADE,
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  route_number VARCHAR(50),
  settlement VARCHAR(255),
  trips_used INTEGER DEFAULT 1,
  kilometers_used DECIMAL(10, 2),
  amount DECIMAL(10, 2),
  card_id UUID REFERENCES cards(id),
  card_type card_type,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_benefit_usage_beneficiary ON benefit_usage(beneficiary_id);
CREATE INDEX idx_benefit_usage_assignment ON benefit_usage(benefit_assignment_id);
CREATE INDEX idx_benefit_usage_used_at ON benefit_usage(used_at);
CREATE INDEX idx_benefit_usage_card ON benefit_usage(card_id);

-- Calculation tasks table
CREATE TABLE calculation_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  benefit_type_id UUID NOT NULL REFERENCES benefit_types(id) ON DELETE CASCADE,
  filters JSONB, -- Filter criteria for selecting beneficiaries
  status task_status DEFAULT 'pending',
  total_beneficiaries INTEGER,
  processed_beneficiaries INTEGER DEFAULT 0,
  error_message TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_calculation_tasks_status ON calculation_tasks(status);
CREATE INDEX idx_calculation_tasks_benefit_type ON calculation_tasks(benefit_type_id);
CREATE INDEX idx_calculation_tasks_created_by ON calculation_tasks(created_by);

-- File uploads log table
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  load_mode load_mode NOT NULL,
  total_rows INTEGER,
  processed_rows INTEGER DEFAULT 0,
  errors JSONB,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_benefit_types_updated_at BEFORE UPDATE ON benefit_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_benefit_assignments_updated_at BEFORE UPDATE ON benefit_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculation_tasks_updated_at BEFORE UPDATE ON calculation_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


