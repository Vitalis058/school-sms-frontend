export type TeacherType = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO string
  gender: "male" | "female" | string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  highestQualification: string;
  specialization: string;
  teachingExperience: "0-2" | "3-5" | "6-10" | "10+" | string;
  subjectsCanTeach: string[];
  gradesCanTeach: string[];
  employmentType: "full_time" | "part_time" | "contract" | string;
  joiningDate: string;
  position: string;
  department: string;
  previousEmployments: string[];
  certifications: string;
  skills: string;
  languages: string;
  additionalNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type StreamsType = {
  id: string;
  name: string;
  teacherId: string;
  slug: string;
  gradeId: string;
};

export type GradesType = {
  students: string;
  streams: string;
  id: string;
  name: string;
};

export type ParentType = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string | null;
  address: string;
  occupation?: string | null;
  dateOfBirth?: string | null;
  educationLevel?: string | null;
  preferredContactMethod: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudentType = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  guardianId: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  admissionNumber: string;
  enrollmentDate: string;
  password: string;
  gradeId: string;
  streamId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type SubjectType = {
  id: string;
  name: string;
  slug: string;
  subjectCode: string;
};

export type DepartmentType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
