/**
 * @bhumitra/types — Shared TypeScript type definitions
 * DHARA — Digital Hub for Acquisition, Rehabilitation & Administration
 * Department of Land Resources (DoLR), Ministry of Rural Development, Government of India
 */

// ─── Auth & Users ────────────────────────────────────────────────────────────

export type RoleCode =
  | 'SUPER_ADMIN'
  | 'DISTRICT_COLLECTOR'
  | 'CALA'
  | 'STATE_NODAL_OFFICER'
  | 'JOINT_SECRETARY'
  | 'TEHSILDAR'
  | 'COMPENSATION_OFFICER'
  | 'RR_OFFICER'
  | 'FIELD_OFFICER'
  | 'CENTRAL_MINISTRY_ADMIN'
  | 'REQUIRING_BODY_OFFICER'
  | 'CITIZEN'
  | 'PUBLIC';

export type PermissionCode =
  | 'project:create'
  | 'project:view'
  | 'project:update'
  | 'project:approve'
  | 'project:delete'
  | 'parcel:create'
  | 'parcel:view'
  | 'parcel:update'
  | 'workflow:view'
  | 'workflow:transition'
  | 'workflow:approve'
  | 'document:upload'
  | 'document:view'
  | 'document:download'
  | 'document:delete'
  | 'compensation:assess'
  | 'compensation:approve'
  | 'compensation:disburse'
  | 'compensation:view'
  | 'rehabilitation:manage'
  | 'rehabilitation:view'
  | 'possession:record'
  | 'possession:approve'
  | 'field:assign'
  | 'field:inspect'
  | 'field:view'
  | 'analytics:view-national'
  | 'analytics:view-state'
  | 'analytics:view-district'
  | 'report:export'
  | 'report:generate'
  | 'audit:view'
  | 'audit:export'
  | 'admin:users'
  | 'admin:roles'
  | 'public:view';

export interface LoginDto {
  userId?: string;
  email?: string;
  password?: string;
  authMode?: 'credentials' | 'sso';
}

export interface UserSession {
  id: string;
  officerId: string;
  name: string;
  email: string;
  role: RoleCode;
  roleLabel: string;
  designation: string;
  jurisdiction: string;
  stateCode?: string;
  districtName?: string;
  organization?: string;
  permissions: PermissionCode[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserSession;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectType =
  | 'Highway'
  | 'Rail'
  | 'Metro'
  | 'Energy'
  | 'Smart City'
  | 'Port'
  | 'Airport'
  | 'Industrial';

export type ProjectStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'DELAYED'
  | 'AT_RISK'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED';

export type ProjectStage =
  | 'SIA'
  | 'SEC_11_PRELIMINARY'
  | 'SEC_15_HEARING'
  | 'SEC_19_DECLARATION'
  | 'VALUATION'
  | 'SEC_23_AWARD'
  | 'COMPENSATION_DISBURSED'
  | 'R_AND_R'
  | 'SEC_38_POSSESSION'
  | 'COMPLETED';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'OVERDUE';
  targetDate: string;
  completedDate?: string;
}

export interface ProjectDto {
  id: string;
  projectCode: string;
  name: string;
  description: string;
  type: ProjectType;
  ministry: string;
  requiringBody: string;
  state: string;
  stateCode: string;
  district: string;
  stage: string;
  stageCode: ProjectStage;
  status: ProjectStatus;
  totalAreaProposedHa: number;
  totalAreaNotifiedHa: number;
  totalAreaAcquiredHa: number;
  estimatedBudgetCr: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  affectedFamilies: number;
  slaDaysRemaining: number;
  riskLevel: RiskLevel;
  delayPredictedDays: number;
  recommendedAction: string;
  targetCompletionDate: string;
  startDate: string;
  milestones?: ProjectMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilterQuery {
  state?: string;
  stateCode?: string;
  district?: string;
  search?: string;
  status?: string;
  stage?: string;
  sector?: string;
  limit?: number;
  offset?: number;
}

// ─── Land Parcels ─────────────────────────────────────────────────────────────

export type LandCategory =
  | 'Agricultural (Irrigated)'
  | 'Agricultural (Dry Crop)'
  | 'Community Gauchar'
  | 'Forest'
  | 'Urban'
  | 'Commercial'
  | 'Residential'
  | 'Government Wasteland';

export type CompensationStatus =
  | 'Hearing Pending'
  | 'Award In Calculation'
  | 'Partially Paid (80%)'
  | 'Disbursed (100%)'
  | 'Escrowed';

export type PossessionStatus =
  | 'Pending Compensation'
  | 'Pending R&R'
  | 'Handover Scheduled'
  | 'Possession Taken';

export type ParcelStageCode = ProjectStage;

export interface ParcelOwner {
  id: string;
  name: string;
  sharePercentage: number;
  bankAccountVerified: boolean;
  isMainOwner: boolean;
  phone?: string;
  panNumber?: string;
}

export interface LandParcelDto {
  id: string;
  parcelNumber: string;
  surveyNo: string;
  projectId: string;
  projectName?: string;
  state: string;
  district: string;
  village: string;
  totalAreaHa: number;
  acquiredAreaHa: number;
  landCategory: LandCategory;
  landUse: string;
  stage: string;
  stageCode: ParcelStageCode;
  compensationStatus: CompensationStatus;
  compensationAssessed: string;
  compensationAssessedAmount: number;
  rrStatus: string;
  possessionStatus: PossessionStatus;
  coordinates: string;
  latitude: number;
  longitude: number;
  boundaryGeoJson?: unknown;
  gazetteNotice: string;
  gazetteDate?: string;
  color?: string;
  owners: ParcelOwner[];
  createdAt: string;
  updatedAt: string;
}

export interface ValuationDto {
  id: string;
  parcelId: string;
  baseLandRatePerHa: number;
  multiplicationFactor: number;
  marketValueTotal: number;
  solatiumPercentage: number;
  solatiumAmount: number;
  assetsValueTreesStructures: number;
  totalAssessedCompensation: number;
  assessedBy: string;
  assessedDate: string;
  status: 'DRAFT' | 'RECOMMENDED' | 'APPROVED' | 'DISPUTED';
}

export interface CompensationAwardDto {
  id: string;
  awardNumber: string;
  parcelId: string;
  projectId: string;
  awardDate: string;
  totalAwardAmount: number;
  solatiumAmount: number;
  additionalInterest: number;
  approvedBy: string;
  status: 'DRAFT' | 'APPROVED' | 'DISBURSED' | 'CONTESTED' | 'DISPUTED';
}

export interface CompensationPaymentDto {
  id: string;
  awardId: string;
  parcelId: string;
  beneficiaryName: string;
  beneficiaryAccountMasked: string;
  bankName: string;
  ifscCode: string;
  amount: number;
  paymentMethod: 'PFMS_DBT' | 'TREASURY_CHALLAN' | 'ESCROW' | 'CHEQUE' | 'DEMAND_DRAFT';
  paymentDate?: string;
  transactionRef?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD' | 'REVERSED';
  remarks?: string;
}

export interface RRCaseDto {
  id: string;
  projectId: string;
  parcelId: string;
  familyHeadName: string;
  familySize: number;
  isScSt: boolean;
  isBpl: boolean;
  displacementType: 'PHYSICAL_DISPLACEMENT' | 'ECONOMIC_DISPLACEMENT' | 'BOTH';
  packageType: string;
  entitlements: string[];
  resettlementPlotNo?: string;
  resettlementColonyName?: string;
  subsistenceGrantAmount: number;
  relocationGrantAmount: number;
  status: 'ELIGIBLE' | 'PACKAGE_SANCTIONED' | 'PLOT_ALLOTTED' | 'DISBURSED' | 'COMPLETED';
  createdAt: string;
  updatedAt?: string;
}

export interface FieldInspectionDto {
  id: string;
  parcelId: string;
  surveyNo: string;
  inspectorName: string;
  inspectionDate: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAccuracyMeters: number;
  observations: string;
  encroachmentFound: boolean;
  evidencePhotos: string[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'DISCREPANCY_NOTED' | 'RE_SURVEY_REQUIRED' | 'DISPUTED';
}

export interface DocumentDto {
  id: string;
  title: string;
  documentType:
    | 'GAZETTE_NOTIFICATION'
    | 'SIA_REPORT'
    | 'KHASRA_MAP'
    | 'VALUATION_CERTIFICATE'
    | 'AWARD_SHEET'
    | 'AWARD_DECREE'
    | 'PAYMENT_RECEIPT'
    | 'FIELD_PHOTO'
    | 'FIELD_REPORT'
    | 'OBJECTION'
    | 'COURT_ORDER'
    | 'OTHER';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  checksumSha256: string;
  version: number;
  uploadedBy: string;
  projectId?: string;
  parcelId?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface NoticeRecord {
  id: string;
  noticeType: string;
  noticeNumber: string;
  issueDate: string;
  publishedInGazette: boolean;
  pdfUrl: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SUPERSEDED';
}

export interface AuditLogDto {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'APPROVE'
    | 'REJECT'
    | 'DISBURSE'
    | 'TRANSITION'
    | 'LOGIN'
    | 'LOGOUT'
    | 'EXPORT'
    | 'FAILED_LOGIN';
  entityType:
    | 'PROJECT'
    | 'PARCEL'
    | 'AWARD'
    | 'COMPENSATION'
    | 'USER'
    | 'DOCUMENT'
    | 'GRIEVANCE';
  entityId: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  remarks?: string;
  timestamp: string;
}

export interface Parcel360Dto {
  parcel: LandParcelDto;
  project: {
    id: string;
    projectCode: string;
    name: string;
    ministry: string;
    slaDaysRemaining: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
    centroid: number[];
  };
  valuation: ValuationDto | null;
  award: CompensationAwardDto | null;
  payments: CompensationPaymentDto[];
  rrCase: RRCaseDto | null;
  grievances: GrievanceDto[];
  inspections: FieldInspectionDto[];
  notices: NoticeRecord[];
  documents: DocumentDto[];
  auditHistory: AuditLogDto[];
}

// ─── Grievances ───────────────────────────────────────────────────────────────

export interface GrievanceAction {
  id: string;
  actorName: string;
  actorRole: string;
  actionTaken: string;
  comments: string;
  timestamp: string;
}

export interface GrievanceDto {
  id: string;
  ticketNumber: string;
  projectId: string;
  projectName: string;
  parcelId?: string;
  surveyNo?: string;
  complainantName: string;
  phone?: string;
  category:
    | 'COMPENSATION_DISPUTE'
    | 'MEASUREMENT_ERROR'
    | 'OWNERSHIP_CLAIM'
    | 'R_AND_R_DENIAL'
    | 'DELAY_IN_PAYMENT'
    | 'PROCEDURAL_LAPSE'
    | 'BOUNDARY_DISPUTE'
    | 'PROCESS_OBJECTION'
    | 'CORRUPTION'
    | 'OTHER';
  description: string;
  filingDate: string;
  hearingDate?: string;
  slaDueDate: string;
  isOverdue: boolean;
  assignedOfficerName: string;
  status:
    | 'SUBMITTED'
    | 'FILED'
    | 'UNDER_INVESTIGATION'
    | 'HEARING_SCHEDULED'
    | 'RESOLVED'
    | 'REJECTED'
    | 'ESCALATED'
    | 'CLOSED';
  resolutionNotes?: string;
  resolutionDate?: string;
  actions: GrievanceAction[];
}

// ─── Workflow & Action Centre ──────────────────────────────────────────────────

export interface WorkflowActionDto {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  actionType:
    | 'SLA_BREACH_RESOLUTION'
    | 'GAZETTE_RESPONSE'
    | 'DISBURSAL_MANDATE_HOLD'
    | 'OBJECTION_HEARING'
    | 'VALUATION_APPROVAL'
    | 'POSSESSION_HANDOVER'
    | 'ENV_CLEARANCE'
    | 'COURT_COMPLIANCE'
    | 'FIELD_SURVEY';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedRole: string;
  dueDate: string;
  daysPending: number;
  daysOverdue: number;
  isOverdue: boolean;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
  escalationLevel: number;
  createdAt: string;
}

export interface ActionCentreResponse {
  summary: {
    totalUrgent: number;
    totalOverdue: number;
    dueToday: number;
    upcoming7Days: number;
    slaComplianceRate: number;
  };
  urgentOverdue: WorkflowActionDto[];
  dueToday: WorkflowActionDto[];
  upcoming: WorkflowActionDto[];
}

export interface TransitionDto {
  projectId: string;
  fromStage: ProjectStage;
  toStage: ProjectStage;
  remarks?: string;
  documentIds?: string[];
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface StateKpiDto {
  state: string;
  projects: number;
  area: string;
  areaHa: number;
  sla: number;
  risk: number;
  color: string;
}

export interface RecentProjectDto {
  id: string;
  name: string;
  state: string;
  stage: string;
  area: string;
  sla: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

export interface PriorityActionSummaryDto {
  id: string;
  title: string;
  projectName: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: string;
  isOverdue: boolean;
}

export interface DecisionSupportInsightDto {
  id: string;
  type: 'WARNING' | 'RECOMMENDATION' | 'PREDICTION' | 'INFO';
  title: string;
  description: string;
  affectedProjectIds?: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface DashboardMetricsDto {
  timestamp: string;
  kpis: {
    totalProjects: number;
    totalAreaHa: number;
    totalAreaAcquiredHa: number;
    compensationPaidCr: number;
    compensationAssessedCr: number;
    slaComplianceRate: number;
    slaAlertsCount: number;
    pendingObjections: number;
  };
  recentProjects: RecentProjectDto[];
  stateKpis: StateKpiDto[];
  priorityActions: PriorityActionSummaryDto[];
}

// ─── GIS / Spatial ────────────────────────────────────────────────────────────

export interface GeoJsonFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Polygon' | 'LineString' | 'Point';
    coordinates: unknown;
  };
  properties: Record<string, unknown>;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
  total: number;
}

export interface SpatialQueryDto {
  projectId?: string;
  state?: string;
  district?: string;
  bbox?: [number, number, number, number];
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: 'SLA_BREACH' | 'ACTION_REQUIRED' | 'STATUS_UPDATE' | 'COMPENSATION_READY' | 'GRIEVANCE_FILED' | 'SYSTEM';
  priority: 'critical' | 'high' | 'medium' | 'low';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

// ─── AI Types ─────────────────────────────────────────────────────────────────

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'mr'
  | 'bn'
  | 'ta'
  | 'te'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa';

export interface AiContext {
  currentPage?: string;
  currentModule?: string;
  projectId?: string;
  parcelId?: string;
  language?: SupportedLanguage;
}

export interface AiConversationContext {
  selectedProjectId?: string;
  selectedProjectCode?: string;
  selectedProjectName?: string;
  lastProjects?: Array<{
    id: string;
    projectCode?: string;
    name: string;
    state?: string;
    riskLevel?: string;
    status?: string;
  }>;
  activeFilters?: Record<string, string>;
  contextLabel?: string;
}

export interface AiQueryDto {
  message: string;
  context?: AiContext | Record<string, unknown>;
  conversationContext?: AiConversationContext;
  conversationId?: string;
  language?: SupportedLanguage;
  inputSource?: 'text' | 'voice';
  attachment?: {
    name: string;
    content: string;
    mimeType?: string;
  };
}

export interface AiMetric {
  label: string;
  value: string | number;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger';
}

export interface AiAction {
  label: string;
  actionType:
    | 'NAVIGATE'
    | 'OPEN_PROJECT'
    | 'OPEN_PARCEL'
    | 'OPEN_COMPENSATION'
    | 'GIS_FILTER'
    | 'GENERATE_REPORT';
  payload?: Record<string, unknown>;
}

export interface AiBottleneck {
  stage: string;
  issue: string;
  affectedCount: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface AiRiskAssessment {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
}

export interface AiStructuredResponse {
  title?: string;
  summary: string;
  language?: SupportedLanguage;
  detectedIntent?: string;
  inputSource?: 'text' | 'voice';
  speakResponse?: boolean;
  spokenSummary?: string;
  conversationContext?: AiConversationContext;
  metrics?: AiMetric[];
  projects?: ProjectDto[];
  facts?: string[];
  actions?: AiAction[];
  analysis?: string[];
  recommendations?: string[];
  bottlenecks?: AiBottleneck[];
  risk?: AiRiskAssessment;
  sources?: string[];
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  structuredResponse?: AiStructuredResponse;
  timestamp: string;
}

export interface AiConversationSession {
  id: string;
  context: AiConversationContext;
  messages: AiMessage[];
  createdAt: string;
  updatedAt: string;
}
