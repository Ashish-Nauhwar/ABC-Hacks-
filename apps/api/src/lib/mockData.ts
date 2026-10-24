// ── In-Memory Mock Data Store for Demo Mode ──────────────────────────────
import { ChallengeDomain, ReportStatus, Severity, UserRole, PartnerType } from "@prisma/client";

export interface MockUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  cityId: string | null;
  universityId: string | null;
}

export interface MockCity {
  id: string;
  name: string;
  state: string;
}

export interface MockUniversity {
  id: string;
  name: string;
  type: string | null;
  specializations: ChallengeDomain[];
  cityId: string;
}

export interface MockIndustryPartner {
  id: string;
  name: string;
  type: PartnerType;
  domains: ChallengeDomain[];
  contactEmail: string | null;
}

export interface MockAuthority {
  id: string;
  name: string;
  designation: string | null;
  department: string | null;
  phone: string | null;
  email: string | null;
  domains: ChallengeDomain[];
  isActive: boolean;
  cityId: string | null;
  universityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockReport {
  id: string;
  description: string;
  photoUrls: string[];
  address: string | null;
  latitude: number;
  longitude: number;
  domain: ChallengeDomain | null;
  severity: Severity | null;
  aiSummary: string | null;
  aiConfidence: number | null;
  priorityScore: number;
  status: ReportStatus;
  isDuplicate: boolean;
  duplicateOfId: string | null;
  facultyMentor: string | null;
  teamNote: string | null;
  industryPartnerId: string | null;
  assignedAuthorityId: string | null;
  assignedAuthority?: MockAuthority | null;
  assignedAt: string | null;
  resolutionEvidenceUrls: string[];
  feedbackRating: number | null;
  feedbackComment: string | null;
  cityId: string;
  universityId: string | null;
  reportedById: string;
  reportedBy?: MockUser;
  createdAt: string;
  updatedAt: string;
  statusEvents?: MockStatusEvent[];
}

export interface MockStatusEvent {
  id: string;
  reportId: string;
  status: ReportStatus;
  note: string | null;
  changedById: string;
  changedBy?: { id: string; name: string; role: UserRole };
  createdAt: string;
}

// ── Seed Cities / Districts ────────────────────────────────────────────────
export const mockCities: MockCity[] = [
  { id: "cmtcityranchi00000000001", name: "Ranchi", state: "Jharkhand" },
  { id: "cmtcitydhanbad0000000002", name: "Dhanbad", state: "Jharkhand" },
  { id: "cmtcityeastsb00000000003", name: "East Singhbhum", state: "Jharkhand" },
  { id: "cmtcitybokaro00000000004", name: "Bokaro", state: "Jharkhand" },
  { id: "cmtcityhazarib0000000005", name: "Hazaribagh", state: "Jharkhand" },
  { id: "cmtcitydeoghar0000000006", name: "Deoghar", state: "Jharkhand" },
];

// ── Seed Universities ─────────────────────────────────────────────────────
export const mockUniversities: MockUniversity[] = [
  {
    id: "uni-bit-mesra-01",
    name: "Birla Institute of Technology, Mesra",
    type: "DEEMED",
    specializations: [ChallengeDomain.URBAN_DEVELOPMENT, ChallengeDomain.ENERGY, ChallengeDomain.ENVIRONMENT],
    cityId: "cmtcityranchi00000000001",
  },
  {
    id: "uni-cuj-ranchi-02",
    name: "Central University of Jharkhand",
    type: "CENTRAL",
    specializations: [ChallengeDomain.EDUCATION, ChallengeDomain.PUBLIC_ADMINISTRATION, ChallengeDomain.RURAL_LIVELIHOODS],
    cityId: "cmtcityranchi00000000001",
  },
  {
    id: "uni-rims-ranchi-03",
    name: "Rajendra Institute of Medical Sciences (RIMS), Ranchi",
    type: "STATE",
    specializations: [ChallengeDomain.HEALTHCARE],
    cityId: "cmtcityranchi00000000001",
  },
  {
    id: "uni-nit-jsr-04",
    name: "National Institute of Technology, Jamshedpur",
    type: "CENTRAL",
    specializations: [ChallengeDomain.URBAN_DEVELOPMENT, ChallengeDomain.ENERGY, ChallengeDomain.ACCESSIBILITY],
    cityId: "cmtcityeastsb00000000003",
  },
  {
    id: "uni-iihm-jsr-05",
    name: "Indian Institute of Health Management, Jamshedpur",
    type: "PRIVATE",
    specializations: [ChallengeDomain.HEALTHCARE, ChallengeDomain.RURAL_LIVELIHOODS],
    cityId: "cmtcityeastsb00000000003",
  },
  {
    id: "uni-iit-ism-06",
    name: "Indian School of Mines / IIT (ISM), Dhanbad",
    type: "CENTRAL",
    specializations: [ChallengeDomain.ENVIRONMENT, ChallengeDomain.WATER_RESOURCES, ChallengeDomain.ENERGY],
    cityId: "cmtcitydhanbad0000000002",
  },
  {
    id: "uni-vbu-hazaribagh-07",
    name: "Vinoba Bhave University, Hazaribagh",
    type: "STATE",
    specializations: [ChallengeDomain.AGRICULTURE, ChallengeDomain.RURAL_LIVELIHOODS, ChallengeDomain.EDUCATION],
    cityId: "cmtcityhazarib0000000005",
  },
  {
    id: "uni-icar-rcer-08",
    name: "ICAR Research Complex for Eastern Region (Jharkhand)",
    type: "RESEARCH",
    specializations: [ChallengeDomain.AGRICULTURE, ChallengeDomain.WATER_RESOURCES],
    cityId: "cmtcityranchi00000000001",
  },
];

// ── Seed Industry Partners ────────────────────────────────────────────────
export const mockIndustryPartners: MockIndustryPartner[] = [
  {
    id: "ind-agrinext-01",
    name: "AgriNext Solutions (Startup)",
    type: PartnerType.STARTUP,
    domains: [ChallengeDomain.AGRICULTURE, ChallengeDomain.RURAL_LIVELIHOODS],
    contactEmail: "partnerships@agrinext.example",
  },
  {
    id: "ind-jhmedtech-02",
    name: "Jharkhand MedTech MSME Cluster",
    type: PartnerType.MSME,
    domains: [ChallengeDomain.HEALTHCARE],
    contactEmail: "info@jhmedtech.example",
  },
  {
    id: "ind-tatasteel-03",
    name: "Tata Steel CSR Foundation",
    type: PartnerType.CSR,
    domains: [ChallengeDomain.URBAN_DEVELOPMENT, ChallengeDomain.ENVIRONMENT, ChallengeDomain.EDUCATION],
    contactEmail: "csr@tatasteel.example",
  },
  {
    id: "ind-cimfr-04",
    name: "CSIR-CIMFR Innovation Lab",
    type: PartnerType.RESEARCH_LAB,
    domains: [ChallengeDomain.ENVIRONMENT, ChallengeDomain.ENERGY, ChallengeDomain.WATER_RESOURCES],
    contactEmail: "innovation@cimfr.example",
  },
  {
    id: "ind-ranchirenew-05",
    name: "Ranchi Renewable Energy Corp",
    type: PartnerType.CORPORATE,
    domains: [ChallengeDomain.ENERGY, ChallengeDomain.URBAN_DEVELOPMENT],
    contactEmail: "contact@ranchirenewable.example",
  },
];

// ── Seed Authorities ──────────────────────────────────────────────────────
export const mockAuthorities: MockAuthority[] = [
  {
    id: "auth-pwd-01",
    name: "Er. Ramesh Oraon",
    designation: "Junior Engineer",
    department: "Public Works Department (PWD)",
    phone: "+91 90000 10001",
    email: "r.oraon.pwd@jharkhand.gov.in",
    domains: [ChallengeDomain.URBAN_DEVELOPMENT, ChallengeDomain.ACCESSIBILITY],
    isActive: true,
    cityId: "cmtcityranchi00000000001",
    universityId: null,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "auth-rmc-02",
    name: "Sunita Kumari",
    designation: "Sanitation Officer",
    department: "Ranchi Municipal Corporation",
    phone: "+91 90000 10002",
    email: "s.kumari.rmc@jharkhand.gov.in",
    domains: [ChallengeDomain.ENVIRONMENT, ChallengeDomain.URBAN_DEVELOPMENT],
    isActive: true,
    cityId: "cmtcityranchi00000000001",
    universityId: null,
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "auth-health-03",
    name: "Dr. Ajay Singh",
    designation: "District Health Officer",
    department: "Dept. of Health & Family Welfare",
    phone: "+91 90000 10003",
    email: "a.singh.health@jharkhand.gov.in",
    domains: [ChallengeDomain.HEALTHCARE],
    isActive: true,
    cityId: "cmtcityranchi00000000001",
    universityId: null,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "auth-bit-04",
    name: "Dr. Anita Kumar",
    designation: "Associate Professor & Nodal Coordinator",
    department: "Dept. of Civil Engineering",
    phone: "+91 90000 20001",
    email: "a.kumar@bitmesra.example",
    domains: [ChallengeDomain.URBAN_DEVELOPMENT, ChallengeDomain.ENVIRONMENT],
    isActive: true,
    cityId: null,
    universityId: "uni-bit-mesra-01",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "auth-rims-05",
    name: "Dr. Meera Prasad",
    designation: "Associate Dean, Community Medicine",
    department: "Dept. of Community Medicine",
    phone: "+91 90000 20003",
    email: "m.prasad@rims.example",
    domains: [ChallengeDomain.HEALTHCARE],
    isActive: true,
    cityId: null,
    universityId: "uni-rims-ranchi-03",
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "auth-iit-06",
    name: "Prof. Deepak Verma",
    designation: "Professor, Dept. of Environmental Science",
    department: "Dept. of Environmental Science & Engineering",
    phone: "+91 90000 20006",
    email: "d.verma@ism.example",
    domains: [ChallengeDomain.ENVIRONMENT, ChallengeDomain.WATER_RESOURCES],
    isActive: true,
    cityId: null,
    universityId: "uni-iit-ism-06",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ── Seed Staff Users ──────────────────────────────────────────────────────
export const mockUsers: MockUser[] = [
  {
    id: "demo-super-admin-001",
    name: "Demo Super Admin",
    email: "dashboard.admin@test.local",
    phone: "+91 99999 99999",
    role: UserRole.SUPER_ADMIN,
    cityId: null,
    universityId: null,
  },
  {
    id: "demo-govt-admin-002",
    name: "Ranchi District Officer",
    email: "ranchi.admin@jharkhand.gov.in",
    phone: "+91 98888 11111",
    role: UserRole.GOVERNMENT_ADMIN,
    cityId: "cmtcityranchi00000000001",
    universityId: null,
  },
  {
    id: "demo-uni-admin-003",
    name: "BIT Mesra Innovation Cell",
    email: "innovation@bitmesra.example",
    phone: "+91 97777 22222",
    role: UserRole.UNIVERSITY_ADMIN,
    cityId: null,
    universityId: "uni-bit-mesra-01",
  },
  {
    id: "demo-citizen-004",
    name: "Alok Murmu",
    email: "alok.murmu@example.com",
    phone: "+91 94311 55555",
    role: UserRole.CITIZEN,
    cityId: "cmtcityranchi00000000001",
    universityId: null,
  },
];

// ── Seed Reports ──────────────────────────────────────────────────────────
export const mockReports: MockReport[] = [
  {
    id: "rep-001-water-pipeline",
    description: "Main potable water supply pipe ruptured near Morabadi Ground. Significant water wastage and flooding across the pedestrian walkway for the past 24 hours.",
    photoUrls: [
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Morabadi Ground Road, Near Tribal Museum, Ranchi",
    latitude: 23.3855,
    longitude: 85.3283,
    domain: ChallengeDomain.WATER_RESOURCES,
    severity: Severity.CRITICAL,
    aiSummary: "Ruptured high-pressure municipal water pipeline causing localized flooding and water loss in Morabadi.",
    aiConfidence: 0.94,
    priorityScore: 88,
    status: ReportStatus.IN_PROGRESS,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: "Prof. Deepak Verma",
    teamNote: "IIT ISM hydraulic modeling team engaged alongside Ranchi Municipal Corp field crew.",
    industryPartnerId: "ind-tatasteel-03",
    assignedAuthorityId: "auth-rmc-02",
    assignedAuthority: mockAuthorities[1],
    assignedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    resolutionEvidenceUrls: [],
    feedbackRating: null,
    feedbackComment: null,
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-iit-ism-06",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    statusEvents: [
      {
        id: "evt-001-1",
        reportId: "rep-001-water-pipeline",
        status: ReportStatus.SUBMITTED,
        note: "Challenge registered via citizen app",
        changedById: "demo-citizen-004",
        changedBy: { id: "demo-citizen-004", name: "Alok Murmu", role: UserRole.CITIZEN },
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      },
      {
        id: "evt-001-2",
        reportId: "rep-001-water-pipeline",
        status: ReportStatus.ACKNOWLEDGED,
        note: "AI categorized as Water Resources (Critical). Route auto-matched to IIT ISM.",
        changedById: "demo-super-admin-001",
        changedBy: { id: "demo-super-admin-001", name: "System / AI", role: UserRole.SUPER_ADMIN },
        createdAt: new Date(Date.now() - 47 * 3600000).toISOString(),
      },
      {
        id: "evt-001-3",
        reportId: "rep-001-water-pipeline",
        status: ReportStatus.IN_PROGRESS,
        note: "Assigned to Sunita Kumari (RMC Sanitation & Works). Heavy machinery deployed.",
        changedById: "demo-super-admin-001",
        changedBy: { id: "demo-super-admin-001", name: "Super Admin", role: UserRole.SUPER_ADMIN },
        createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: "rep-002-solar-microgrid",
    description: "Rural solar microgrid inverter tripped in Angara village cluster. 45 households and the primary school are without electricity.",
    photoUrls: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Village Jonha, Block Angara, Ranchi District",
    latitude: 23.3762,
    longitude: 85.5891,
    domain: ChallengeDomain.ENERGY,
    severity: Severity.HIGH,
    aiSummary: "Off-grid community solar inverter failure leading to blackout in 45 rural dwellings.",
    aiConfidence: 0.91,
    priorityScore: 78,
    status: ReportStatus.ASSIGNED,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: "Dr. Arvind Sinha (NIT Jamshedpur)",
    teamNote: "Student hardware hackathon group dispatched with replacement charge controllers.",
    industryPartnerId: "ind-ranchirenew-05",
    assignedAuthorityId: "auth-pwd-01",
    assignedAuthority: mockAuthorities[0],
    assignedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    resolutionEvidenceUrls: [],
    feedbackRating: null,
    feedbackComment: null,
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-bit-mesra-01",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    statusEvents: [
      {
        id: "evt-002-1",
        reportId: "rep-002-solar-microgrid",
        status: ReportStatus.SUBMITTED,
        note: "Report filed from village community center",
        changedById: "demo-citizen-004",
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
      {
        id: "evt-002-2",
        reportId: "rep-002-solar-microgrid",
        status: ReportStatus.ASSIGNED,
        note: "Assigned to BIT Mesra Energy lab + Ranchi Renewable Energy Corp",
        changedById: "demo-super-admin-001",
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: "rep-003-health-phc-stockout",
    description: "Primary Health Centre in Bundu running critically low on anti-snake venom and oral rehydration salts during monsoon season.",
    photoUrls: [
      "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Bundu Community Health Centre, NH-33, Ranchi District",
    latitude: 23.1611,
    longitude: 85.5861,
    domain: ChallengeDomain.HEALTHCARE,
    severity: Severity.CRITICAL,
    aiSummary: "Critical medical inventory stockout (anti-venom, ORS) at rural Bundu health center.",
    aiConfidence: 0.96,
    priorityScore: 92,
    status: ReportStatus.IN_PROGRESS,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: "Dr. Meera Prasad (RIMS)",
    teamNote: "Emergency replenishment drone transit pathway tested from RIMS central store.",
    industryPartnerId: "ind-jhmedtech-02",
    assignedAuthorityId: "auth-health-03",
    assignedAuthority: mockAuthorities[2],
    assignedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    resolutionEvidenceUrls: [],
    feedbackRating: null,
    feedbackComment: null,
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-rims-ranchi-03",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "rep-004-potholes-drainage",
    description: "Deep crater-sized potholes and blocked stormwater drain causing waterlogging and vehicle accidents near Albert Ekka Chowk.",
    photoUrls: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Main Road, Albert Ekka Chowk, Upper Bazar, Ranchi",
    latitude: 23.3700,
    longitude: 85.3250,
    domain: ChallengeDomain.URBAN_DEVELOPMENT,
    severity: Severity.HIGH,
    aiSummary: "Severe road deterioration and storm drain blockage causing chronic traffic halts.",
    aiConfidence: 0.88,
    priorityScore: 74,
    status: ReportStatus.ASSIGNED,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: "Dr. Anita Kumar (BIT Mesra)",
    teamNote: "Bituminous cold mix patch test by civil engineering lab.",
    industryPartnerId: "ind-tatasteel-03",
    assignedAuthorityId: "auth-pwd-01",
    assignedAuthority: mockAuthorities[0],
    assignedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    resolutionEvidenceUrls: [],
    feedbackRating: null,
    feedbackComment: null,
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-bit-mesra-01",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
  {
    id: "rep-005-smart-classroom",
    description: "Government High School Kanke digital smart classroom equipment has no internet backhaul connection and needs digital literacy curriculum.",
    photoUrls: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Govt High School, Kanke Road, Ranchi",
    latitude: 23.4350,
    longitude: 85.3200,
    domain: ChallengeDomain.EDUCATION,
    severity: Severity.MEDIUM,
    aiSummary: "Smart class connectivity deficit and need for student volunteer trainers.",
    aiConfidence: 0.92,
    priorityScore: 56,
    status: ReportStatus.RESOLVED,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: "Prof. Suresh Kumar (CUJ)",
    teamNote: "Central University education interns installed offline e-Vidya cache servers.",
    industryPartnerId: "ind-tatasteel-03",
    assignedAuthorityId: "auth-pwd-01",
    assignedAuthority: mockAuthorities[0],
    assignedAt: new Date(Date.now() - 100 * 3600000).toISOString(),
    resolutionEvidenceUrls: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    ],
    feedbackRating: 5,
    feedbackComment: "Excellent intervention, the student volunteers set up digital modules within 2 days!",
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-cuj-ranchi-02",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
  {
    id: "rep-006-paddy-blast-disease",
    description: "Widespread leaf blast fungal infection spreading across standing Kharif paddy fields in Ormanjhi blocks. Urgent agricultural advisory needed.",
    photoUrls: [
      "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Ormanjhi Block Agricultural Cluster, Ranchi District",
    latitude: 23.4833,
    longitude: 85.4833,
    domain: ChallengeDomain.AGRICULTURE,
    severity: Severity.HIGH,
    aiSummary: "Fungal crop disease outbreak requiring diagnostic confirmation and organic bio-fungicide dosing.",
    aiConfidence: 0.95,
    priorityScore: 82,
    status: ReportStatus.ACKNOWLEDGED,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: "Dr. Sarita Devi (Vinoba Bhave Univ / ICAR)",
    teamNote: "ICAR Eastern Region scientists analyzing leaf samples.",
    industryPartnerId: "ind-agrinext-01",
    assignedAuthorityId: null,
    assignedAuthority: null,
    assignedAt: null,
    resolutionEvidenceUrls: [],
    feedbackRating: null,
    feedbackComment: null,
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-icar-rcer-08",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: "rep-007-river-plastic-waste",
    description: "Illegal plastic dumping along Subarnarekha river bank causing microplastic contamination and choking drainage channels.",
    photoUrls: [
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Subarnarekha Ghat, Namkum, Ranchi",
    latitude: 23.3361,
    longitude: 85.3850,
    domain: ChallengeDomain.ENVIRONMENT,
    severity: Severity.MEDIUM,
    aiSummary: "Riverbank plastic debris accumulation threatening riparian ecology and stormwater runoff.",
    aiConfidence: 0.90,
    priorityScore: 61,
    status: ReportStatus.SUBMITTED,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: null,
    teamNote: null,
    industryPartnerId: null,
    assignedAuthorityId: null,
    assignedAuthority: null,
    assignedAt: null,
    resolutionEvidenceUrls: [],
    feedbackRating: null,
    feedbackComment: null,
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-bit-mesra-01",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "rep-008-wheelchair-ramp",
    description: "Ramp at the District Social Welfare Office is damaged and has an unsafe slope (>1:6). Persons with disability cannot access pension verification.",
    photoUrls: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Collectorate Compound, Kutchery Road, Ranchi",
    latitude: 23.3745,
    longitude: 85.3205,
    domain: ChallengeDomain.ACCESSIBILITY,
    severity: Severity.HIGH,
    aiSummary: "Non-compliant and structurally broken access ramp denying disabled citizens entry to administrative services.",
    aiConfidence: 0.93,
    priorityScore: 76,
    status: ReportStatus.ASSIGNED,
    isDuplicate: false,
    duplicateOfId: null,
    facultyMentor: "Dr. Arvind Sinha (NIT Jamshedpur)",
    teamNote: "Universal accessibility audit completed; modular metal ramp design shared with PWD.",
    industryPartnerId: "ind-tatasteel-03",
    assignedAuthorityId: "auth-pwd-01",
    assignedAuthority: mockAuthorities[0],
    assignedAt: new Date(Date.now() - 40 * 3600000).toISOString(),
    resolutionEvidenceUrls: [],
    feedbackRating: null,
    feedbackComment: null,
    cityId: "cmtcityranchi00000000001",
    universityId: "uni-nit-jsr-04",
    reportedById: "demo-citizen-004",
    reportedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 3600000).toISOString(),
  },
];

// ── In-Memory Store Methods ───────────────────────────────────────────────
export function getMockOverview() {
  const byStatus: Record<ReportStatus, number> = {
    SUBMITTED: 0,
    ACKNOWLEDGED: 0,
    ASSIGNED: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    REJECTED: 0,
    DUPLICATE: 0,
  };
  const byDomain: Record<ChallengeDomain, number> = {
    EDUCATION: 0,
    HEALTHCARE: 0,
    AGRICULTURE: 0,
    WATER_RESOURCES: 0,
    ENVIRONMENT: 0,
    ENERGY: 0,
    URBAN_DEVELOPMENT: 0,
    ACCESSIBILITY: 0,
    PUBLIC_ADMINISTRATION: 0,
    RURAL_LIVELIHOODS: 0,
    OTHER: 0,
  };
  const bySeverity: Record<Severity, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };

  let openReports = 0;
  for (const r of mockReports) {
    if (r.status in byStatus) byStatus[r.status]++;
    if (r.domain && r.domain in byDomain) byDomain[r.domain]++;
    if (r.severity && r.severity in bySeverity) bySeverity[r.severity]++;
    if (["SUBMITTED", "ACKNOWLEDGED", "ASSIGNED", "IN_PROGRESS"].includes(r.status)) {
      openReports++;
    }
  }

  const byUniversity = [
    { universityId: "uni-bit-mesra-01", universityName: "Birla Institute of Technology, Mesra", count: 3 },
    { universityId: "uni-rims-ranchi-03", universityName: "RIMS Ranchi", count: 1 },
    { universityId: "uni-iit-ism-06", universityName: "IIT (ISM) Dhanbad", count: 1 },
    { universityId: "uni-nit-jsr-04", universityName: "NIT Jamshedpur", count: 1 },
    { universityId: "uni-cuj-ranchi-02", universityName: "Central University of Jharkhand", count: 1 },
    { universityId: "uni-icar-rcer-08", universityName: "ICAR Eastern Region", count: 1 },
  ];

  return {
    totalReports: mockReports.length,
    openReports,
    pendingClassification: 0,
    averageResolutionHours: 28.5,
    universitiesEngaged: 6,
    industryEngagedCount: mockIndustryPartners.length,
    byStatus,
    byDomain,
    bySeverity,
    byUniversity,
  };
}

export function getMockReports(filters?: { status?: string; domain?: string }) {
  let list = [...mockReports];
  if (filters?.status) {
    list = list.filter((r) => r.status === filters.status);
  }
  if (filters?.domain) {
    list = list.filter((r) => r.domain === filters.domain);
  }
  return list;
}

export function getMockReportById(id: string) {
  return mockReports.find((r) => r.id === id) ?? null;
}

export function updateMockReport(id: string, updates: Partial<MockReport>) {
  const index = mockReports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = mockReports[index];
  const updated: MockReport = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.status && updates.status !== current.status) {
    const event: MockStatusEvent = {
      id: `evt-${Date.now()}`,
      reportId: id,
      status: updates.status,
      note: updates.teamNote || `Status transitioned to ${updates.status}`,
      changedById: "demo-super-admin-001",
      changedBy: { id: "demo-super-admin-001", name: "Demo Super Admin", role: UserRole.SUPER_ADMIN },
      createdAt: new Date().toISOString(),
    };
    updated.statusEvents = [event, ...(current.statusEvents || [])];
  }

  if (updates.assignedAuthorityId) {
    const auth = mockAuthorities.find((a) => a.id === updates.assignedAuthorityId);
    updated.assignedAuthority = auth ?? null;
    updated.assignedAt = new Date().toISOString();
  }

  mockReports[index] = updated;
  return updated;
}
