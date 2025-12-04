export enum BeneficiaryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVE = 'archive',
  UNDER_REVIEW = 'under_review',
  POSSIBLY_LOST = 'possibly_lost',
}

export enum OperationType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  LOADED = 'loaded',
  BENEFIT_ASSIGNED = 'benefit_assigned',
  BENEFIT_USED = 'benefit_used',
  CARD_LINKED = 'card_linked',
  CARD_UNLINKED = 'card_unlinked',
  STATUS_CHANGED = 'status_changed',
  BENEFIT_TYPE_CHANGED = 'benefit_type_changed',
}

export enum BenefitCalculationType {
  FIXED_TRIPS = 'fixed_trips',
  KILOMETER_LIMIT = 'kilometer_limit',
  DISCOUNT_PERCENT = 'discount_percent',
  FREE = 'free',
}

export enum CardType {
  RFID = 'rfid',
  NFC = 'nfc',
  HASH_PAN = 'hash_pan',
}

export enum LoadMode {
  FULL_SYNC = 'full_sync',
  SOFT_ADD = 'soft_add',
  ONLY_NEW = 'only_new',
  ONLY_UPDATE = 'only_update',
  FULL_RELOAD = 'full_reload',
  WITH_ARCHIVE = 'with_archive',
  WITH_MANUAL_REVIEW = 'with_manual_review',
  WITH_DELAYED_DEACTIVATION = 'with_delayed_deactivation',
  BY_LOAD_COUNTER = 'by_load_counter',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Beneficiary {
  id: string;
  fullName: string;
  birthDate: Date;
  phone: string;
  email?: string;
  snils?: string;
  hashPan?: string;
  nfcId?: string;
  rfid?: string;
  benefitTypeId?: string | null;
  benefitTypeName?: string | null;
  status: BeneficiaryStatus;
  residence?: string;
  lastLoadedAt?: Date;
  loadCounter?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BenefitType {
  id: string;
  name: string;
  description?: string;
  routes?: string[];
  settlements?: string[];
  timeRestrictions?: {
    daysOfWeek?: number[];
    hours?: { from: string; to: string };
  };
  calculationType: BenefitCalculationType;
  calculationParams?: {
    trips?: number;
    kilometers?: number;
    discountPercent?: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BeneficiaryOperation {
  id: string;
  beneficiaryId: string;
  operationType: OperationType;
  performedBy: string;
  performedByName: string;
  details?: Record<string, any>;
  createdAt: Date;
}

export interface BenefitAssignment {
  id: string;
  beneficiaryId: string;
  benefitTypeId: string;
  tripsRemaining?: number;
  kilometersRemaining?: number;
  discountPercent?: number;
  validFrom: Date;
  validTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BenefitUsage {
  id: string;
  benefitAssignmentId: string;
  beneficiaryId: string;
  routeNumber?: string;
  settlement?: string;
  tripsUsed?: number;
  kilometersUsed?: number;
  amount?: number;
  cardId?: string;
  cardType?: CardType;
  usedAt: Date;
}

export interface CalculationTask {
  id: string;
  name: string;
  description?: string;
  benefitTypeId: string;
  filters?: Record<string, any>;
  status: TaskStatus;
  totalBeneficiaries?: number;
  processedBeneficiaries?: number;
  errorMessage?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Card {
  id: string;
  beneficiaryId: string;
  cardType: CardType;
  cardIdentifier: string;
  isActive: boolean;
  linkedAt: Date;
  unlinkedAt?: Date;
}


