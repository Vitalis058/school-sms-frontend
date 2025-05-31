// Base response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// User and Authentication Types
export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  image?: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF" | "DRIVER" | "LIBRARIAN";
  departmentId?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  Department?: Department;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF" | "DRIVER" | "LIBRARIAN";
  firstName?: string;
  lastName?: string;
  image?: string;
  departmentId?: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF" | "DRIVER" | "LIBRARIAN";
  firstName?: string;
  lastName?: string;
  image?: string;
  isActive?: boolean;
  departmentId?: string;
}

export interface UserFilters {
  role?: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF" | "DRIVER" | "LIBRARIAN";
  isActive?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  departmentId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  success: boolean;
  message?: string;
}

// Student Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  admissionNumber: string;
  enrollmentDate: string;
  gradeId: string;
  streamId: string;
  guardianId: string;
  guardianName?: string;
  guardianPhone?: string;
  message?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE" | "GRADUATED" | "TRANSFERRED";
  createdAt: string;
  updatedAt: string;
  Grade?: Grade;
  Stream?: Stream;
  Guardian?: Guardian;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phoneNumber?: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  admissionNumber: string;
  enrollmentDate: string;
  gradeId: string;
  streamId: string;
  guardianId: string;
  password: string;
  message?: string;
}

// Teacher Types
export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  highestQualification: string;
  specialization: string;
  teachingExperience: string;
  gradesCanTeach: string[];
  employmentType: "full_time" | "part_time" | "contract";
  joiningDate: string;
  position: string;
  previousEmployments: any;
  certifications?: string;
  skills?: string;
  languages?: string;
  additionalNotes?: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
  Department?: Department;
  Stream?: Stream;
  subjects?: Subject[];
}

export interface CreateTeacherRequest extends Omit<Teacher, "id" | "createdAt" | "updatedAt" | "Department" | "Stream" | "subjects"> {}

// Guardian/Parent Types
export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address: string;
  occupation?: string;
  dateOfBirth?: string;
  educationLevel?: string;
  preferredContactMethod: "phone" | "email" | "both";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  students?: Student[];
}

export interface CreateGuardianRequest extends Omit<Guardian, "id" | "createdAt" | "updatedAt" | "students"> {}

// Academic Structure Types
export interface Grade {
  id: string;
  slug: string;
  name: string;
  streams?: Stream[];
  students?: Student[];
}

export interface CreateGradeRequest {
  name: string;
  slug: string;
}

export interface Stream {
  id: string;
  name: string;
  slug: string;
  gradeId: string;
  teacherId?: string;
  Grade?: Grade;
  Teacher?: Teacher;
  students?: Student[];
  lessons?: Lesson[];
}

export interface CreateStreamRequest {
  name: string;
  slug?: string;
  gradeId: string;
  teacherId?: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  teachers?: Teacher[];
  subjects?: Subject[];
}

export interface CreateDepartmentRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  subjectCode: string;
  shortname: string;
  departmentId: string;
  active: boolean;
  optional: boolean;
  fieldtrips: boolean;
  labRequired: boolean;
  createdAt: string;
  updatedAt: string;
  Department?: Department;
  teachers?: Teacher[];
  lessons?: Lesson[];
}

export interface CreateSubjectRequest {
  name: string;
  slug: string;
  subjectCode: string;
  shortname: string;
  departmentId: string;
  active?: boolean;
  optional?: boolean;
  fieldtrips?: boolean;
  labRequired?: boolean;
}

// Lesson and Scheduling Types
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  name: string;
  lessons?: Lesson[];
}

export interface CreateTimeSlotRequest {
  startTime: string;
  endTime: string;
  name: string;
}

export interface Lesson {
  id: string;
  name: string;
  description?: string;
  day: string;
  teacherId: string;
  subjectId: string;
  streamId: string;
  timeSlotId: string;
  createdAt: string;
  updatedAt: string;
  Teacher?: Teacher;
  Subject?: Subject;
  Stream?: Stream;
  TimeSlot?: TimeSlot;
}

export interface CreateLessonRequest {
  name: string;
  description?: string;
  day: string;
  teacherId: string;
  subjectId: string;
  streamId: string;
  timeSlotId: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  Student?: Student;
}

export interface CreateAttendanceRequest {
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

// Filter and Query Types
export interface StudentFilters {
  gradeId?: string;
  streamId?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface TeacherFilters {
  departmentId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface LessonFilters {
  streamId?: string;
  teacherId?: string;
  subjectId?: string;
  day?: string;
  page?: number;
  pageSize?: number;
}

// Performance Types
export interface StudentPerformance {
  id: string;
  studentId: string;
  student: Student;
  subjectId: string;
  subject: Subject;
  gradeId: string;
  grade: Grade;
  streamId: string;
  stream: Stream;
  academicYear: string;
  term: string;
  assessmentType: 'EXAM' | 'ASSIGNMENT' | 'QUIZ' | 'PROJECT' | 'CONTINUOUS_ASSESSMENT';
  score: number;
  maxScore: number;
  percentage: number;
  grade_letter: string;
  remarks?: string;
  assessmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceAnalytics {
  studentId: string;
  student: Student;
  overallAverage: number;
  previousAverage: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  subjectPerformances: SubjectPerformance[];
  classRank: number;
  totalStudents: number;
  attendanceRate: number;
  improvementAreas: string[];
  strengths: string[];
}

export interface SubjectPerformance {
  subjectId: string;
  subject: Subject;
  currentAverage: number;
  previousAverage: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  assessmentCount: number;
  lastAssessmentDate: string;
  grade: string;
}

export interface ClassPerformanceStats {
  gradeId: string;
  grade: Grade;
  streamId: string;
  stream: Stream;
  totalStudents: number;
  averageScore: number;
  previousAverageScore: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  topPerformers: StudentPerformance[];
  needsAttention: StudentPerformance[];
  subjectStats: SubjectStats[];
}

export interface SubjectStats {
  subjectId: string;
  subject: Subject;
  averageScore: number;
  previousAverageScore: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  passRate: number;
  highestScore: number;
  lowestScore: number;
}

export interface PerformanceFilter {
  gradeId?: string;
  streamId?: string;
  subjectId?: string;
  academicYear?: string;
  term?: string;
  assessmentType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PerformanceResponse {
  success: boolean;
  data: PerformanceAnalytics[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClassPerformanceResponse {
  success: boolean;
  data: ClassPerformanceStats;
}

// Fee Management Types
export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  gradeId: string;
  streamId?: string;
  academicYear: string;
  term: string;
  amount: number;
  dueDate: string;
  isOptional: boolean;
  category: FeeCategory;
  createdAt: string;
  updatedAt: string;
  Grade?: Grade;
  Stream?: Stream;
  FeePayments?: FeePayment[];
}

export interface FeePayment {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  status: PaymentStatus;
  remarks?: string;
  receiptNumber: string;
  createdAt: string;
  updatedAt: string;
  Student?: Student;
  FeeStructure?: FeeStructure;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  feeStructureId: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: FeeStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  Student?: Student;
  FeeStructure?: FeeStructure;
  FeePayments?: FeePayment[];
}

export interface FeeStatement {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  grade: string;
  stream?: string;
  academicYear: string;
  totalFees: number;
  totalPaid: number;
  totalBalance: number;
  feeRecords: FeeRecord[];
  payments: FeePayment[];
}

export interface FeeAnalytics {
  totalFeesCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  overdueStudents: number;
  monthlyCollection: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  categoryWiseCollection: Array<{
    category: FeeCategory;
    amount: number;
    percentage: number;
  }>;
  gradeWiseCollection: Array<{
    gradeId: string;
    gradeName: string;
    totalAmount: number;
    collectedAmount: number;
    collectionRate: number;
  }>;
}

export interface FeeReminder {
  id: string;
  studentId: string;
  feeRecordId: string;
  reminderType: ReminderType;
  sentDate: string;
  dueDate: string;
  amount: number;
  status: ReminderStatus;
  Student?: Student;
  FeeRecord?: FeeRecord;
}

export interface Scholarship {
  id: string;
  name: string;
  description?: string;
  type: ScholarshipType;
  amount: number;
  percentage?: number;
  criteria: string;
  academicYear: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ScholarshipApplications?: ScholarshipApplication[];
}

export interface ScholarshipApplication {
  id: string;
  studentId: string;
  scholarshipId: string;
  applicationDate: string;
  status: ApplicationStatus;
  approvedAmount?: number;
  approvedDate?: string;
  remarks?: string;
  documents?: string[];
  Student?: Student;
  Scholarship?: Scholarship;
}

// Enums for Fee Management
export type FeeCategory = 
  | "TUITION" 
  | "ADMISSION" 
  | "EXAMINATION" 
  | "LIBRARY" 
  | "LABORATORY" 
  | "TRANSPORT" 
  | "HOSTEL" 
  | "SPORTS" 
  | "ACTIVITY" 
  | "MISCELLANEOUS";

export type PaymentMethod = 
  | "CASH" 
  | "BANK_TRANSFER" 
  | "CHEQUE" 
  | "ONLINE" 
  | "CARD" 
  | "UPI" 
  | "MOBILE_MONEY";

export type PaymentStatus = 
  | "PENDING" 
  | "COMPLETED" 
  | "FAILED" 
  | "CANCELLED" 
  | "REFUNDED";

export type FeeStatus = 
  | "PENDING" 
  | "PARTIAL" 
  | "PAID" 
  | "OVERDUE" 
  | "WAIVED";

export type ReminderType = 
  | "EMAIL" 
  | "SMS" 
  | "PHONE" 
  | "LETTER";

export type ReminderStatus = 
  | "SENT" 
  | "DELIVERED" 
  | "FAILED" 
  | "PENDING";

export type ScholarshipType = 
  | "MERIT" 
  | "NEED_BASED" 
  | "SPORTS" 
  | "ACADEMIC" 
  | "MINORITY" 
  | "GOVERNMENT";

export type ApplicationStatus = 
  | "PENDING" 
  | "UNDER_REVIEW" 
  | "APPROVED" 
  | "REJECTED" 
  | "CANCELLED";

// Request/Response Types for Fee Management
export interface CreateFeeStructureRequest {
  name: string;
  description?: string;
  gradeId: string;
  streamId?: string;
  academicYear: string;
  term: string;
  amount: number;
  dueDate: string;
  isOptional: boolean;
  category: FeeCategory;
}

export interface CreateFeePaymentRequest {
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  remarks?: string;
}

export interface FeeFilters {
  gradeId?: string;
  streamId?: string;
  academicYear?: string;
  term?: string;
  category?: FeeCategory;
  status?: FeeStatus;
  studentId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaymentFilters {
  studentId?: string;
  feeStructureId?: string;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateScholarshipRequest {
  name: string;
  description?: string;
  type: ScholarshipType;
  amount: number;
  percentage?: number;
  criteria: string;
  academicYear: string;
  isActive: boolean;
}

export interface CreateScholarshipApplicationRequest {
  studentId: string;
  scholarshipId: string;
  documents?: string[];
  remarks?: string;
}

// Transport Management Types
export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  hireDate: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "SUSPENDED";
  experience: number; // years
  vehicleAssigned?: string; // vehicle ID
  image?: string;
  createdAt: string;
  updatedAt: string;
  Vehicle?: Vehicle;
  MaintenanceReports?: MaintenanceReport[];
  VehicleBookings?: VehicleBooking[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin: string;
  color: string;
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
  capacity: number; // number of passengers
  mileage: number;
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "OUT_OF_SERVICE";
  driverId?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue?: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
  Driver?: Driver;
  MaintenanceReports?: MaintenanceReport[];
  VehicleBookings?: VehicleBooking[];
}

export interface VehicleBooking {
  id: string;
  vehicleId: string;
  driverId: string;
  requestedBy: string; // user ID (teacher/admin)
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  passengers: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  approvedBy?: string; // admin user ID
  approvalDate?: string;
  notes?: string;
  mileageStart?: number;
  mileageEnd?: number;
  fuelUsed?: number;
  createdAt: string;
  updatedAt: string;
  Vehicle?: Vehicle;
  Driver?: Driver;
  RequestedByUser?: User;
  ApprovedByUser?: User;
}

export interface MaintenanceReport {
  id: string;
  vehicleId: string;
  driverId: string;
  type: "ROUTINE" | "REPAIR" | "INSPECTION" | "EMERGENCY";
  title: string;
  description: string;
  serviceDate: string;
  cost: number;
  serviceProvider: string;
  mileageAtService: number;
  nextServiceDue?: string;
  partsReplaced?: string[];
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  Vehicle?: Vehicle;
  Driver?: Driver;
}

export interface TransportAnalytics {
  totalVehicles: number;
  availableVehicles: number;
  vehiclesInUse: number;
  vehiclesInMaintenance: number;
  totalDrivers: number;
  activeDrivers: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  monthlyUsage: Array<{
    month: string;
    bookings: number;
    mileage: number;
    fuelCost: number;
  }>;
  maintenanceCosts: Array<{
    month: string;
    cost: number;
    count: number;
  }>;
  vehicleUtilization: Array<{
    vehicleId: string;
    vehicleName: string;
    utilizationRate: number;
    totalBookings: number;
  }>;
}

// Request/Response Types for Transport Management
export interface CreateDriverRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  hireDate: string;
  experience: number;
  image?: string;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin: string;
  color: string;
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
  capacity: number;
  mileage: number;
  insuranceExpiry: string;
  registrationExpiry: string;
  purchaseDate: string;
  purchasePrice: number;
  driverId?: string;
  image?: string;
}

export interface CreateVehicleBookingRequest {
  vehicleId: string;
  driverId: string;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  passengers: number;
  notes?: string;
}

export interface CreateMaintenanceReportRequest {
  vehicleId: string;
  type: "ROUTINE" | "REPAIR" | "INSPECTION" | "EMERGENCY";
  title: string;
  description: string;
  serviceDate: string;
  cost: number;
  serviceProvider: string;
  mileageAtService: number;
  nextServiceDue?: string;
  partsReplaced?: string[];
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  attachments?: string[];
}

export interface TransportFilters {
  status?: string;
  driverId?: string;
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// Library Management Types
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishedYear: number;
  category: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  location: string; // shelf location
  language: string;
  pages?: number;
  price?: number;
  image?: string;
  status: "AVAILABLE" | "CHECKED_OUT" | "RESERVED" | "DAMAGED" | "LOST";
  createdAt: string;
  updatedAt: string;
  BookIssues?: BookIssue[];
}

export interface BookIssue {
  id: string;
  bookId: string;
  userId: string; // student or teacher ID
  userType: "STUDENT" | "TEACHER";
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "ISSUED" | "RETURNED" | "OVERDUE" | "LOST" | "DAMAGED";
  renewalCount: number;
  maxRenewals: number;
  fineAmount?: number;
  finePaid?: boolean;
  notes?: string;
  issuedBy: string; // librarian ID
  returnedTo?: string; // librarian ID
  createdAt: string;
  updatedAt: string;
  Book?: Book;
  User?: User;
  IssuedByUser?: User;
  ReturnedToUser?: User;
}

export interface LibraryMember {
  id: string;
  userId: string;
  userType: "STUDENT" | "TEACHER";
  membershipNumber: string;
  membershipDate: string;
  status: "ACTIVE" | "SUSPENDED" | "EXPIRED";
  maxBooksAllowed: number;
  currentBooksIssued: number;
  totalFines: number;
  totalFinesPaid: number;
  createdAt: string;
  updatedAt: string;
  User?: User;
  BookIssues?: BookIssue[];
}

export interface LibraryAnalytics {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  overdueBooks: number;
  totalMembers: number;
  activeMembers: number;
  totalFines: number;
  collectedFines: number;
  monthlyIssues: Array<{
    month: string;
    issues: number;
    returns: number;
  }>;
  popularBooks: Array<{
    bookId: string;
    title: string;
    author: string;
    issueCount: number;
  }>;
  categoryStats: Array<{
    category: string;
    totalBooks: number;
    issuedBooks: number;
    utilizationRate: number;
  }>;
}

// Request/Response Types for Library Management
export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishedYear: number;
  category: string;
  description?: string;
  totalCopies: number;
  location: string;
  language: string;
  pages?: number;
  price?: number;
  image?: string;
}

export interface CreateBookIssueRequest {
  bookId: string;
  userId: string;
  userType: "STUDENT" | "TEACHER";
  dueDate: string;
  notes?: string;
}

export interface ReturnBookRequest {
  bookIssueId: string;
  returnDate: string;
  condition: "GOOD" | "DAMAGED" | "LOST";
  notes?: string;
  fineAmount?: number;
}

export interface RenewBookRequest {
  bookIssueId: string;
  newDueDate: string;
  notes?: string;
}

export interface LibraryFilters {
  category?: string;
  status?: string;
  author?: string;
  publisher?: string;
  language?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface BookIssueFilters {
  bookId?: string;
  userId?: string;
  userType?: "STUDENT" | "TEACHER";
  status?: string;
  isOverdue?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} 