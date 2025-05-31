export interface AttendanceRecord {
  id: string;
  studentId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    profileImage?: string;
  };
  classId: string;
  class: {
    id: string;
    name: string;
    grade: string;
    stream: string;
  };
  date: string;
  status: AttendanceStatus;
  timeIn?: string;
  timeOut?: string;
  remarks?: string;
  markedBy: string;
  markedAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
  SICK = "SICK",
  SUSPENDED = "SUSPENDED"
}

export interface AttendanceFilters {
  gradeId?: string;
  streamId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  studentId?: string;
}

export interface AttendanceStats {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
}

export interface StudentAttendanceSummary {
  studentId: string;
  student: {
    firstName: string;
    lastName: string;
    admissionNumber: string;
    profileImage?: string;
  };
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
  lastAttendance?: AttendanceRecord;
}

export interface ClassAttendanceData {
  classId: string;
  className: string;
  date: string;
  students: {
    studentId: string;
    student: {
      firstName: string;
      lastName: string;
      admissionNumber: string;
      profileImage?: string;
    };
    status: AttendanceStatus;
    timeIn?: string;
    timeOut?: string;
    remarks?: string;
  }[];
  stats: AttendanceStats;
}

export interface AttendanceReportData {
  period: {
    startDate: string;
    endDate: string;
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
  };
  classInfo: {
    id: string;
    name: string;
    grade: string;
    stream: string;
    totalStudents: number;
  };
  summary: AttendanceStats;
  studentSummaries: StudentAttendanceSummary[];
  dailyStats: {
    date: string;
    stats: AttendanceStats;
  }[];
}

export interface BulkAttendanceUpdate {
  classId: string;
  date: string;
  attendanceRecords: {
    studentId: string;
    status: AttendanceStatus;
    timeIn?: string;
    timeOut?: string;
    remarks?: string;
  }[];
}

export interface AttendanceNotification {
  id: string;
  studentId: string;
  parentId: string;
  type: 'absent' | 'late' | 'pattern';
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface AttendancePattern {
  studentId: string;
  pattern: 'chronic_absence' | 'frequent_late' | 'improving' | 'declining';
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
} 