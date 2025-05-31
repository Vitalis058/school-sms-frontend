import z from "zod";

//student enrollment
export const StudentEnrollmentSchema = z.object({
  // Personal Info
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of Birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  guardianId: z.string().min(1, { message: "guardian is required" }),

  // Contact Info
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),

  // Address Info
  streetAddress: z.string().min(1, "streetAddress or name is required"),
  city: z.string().min(1, { message: "city of residence is required" }),
  state: z.string().min(1, { message: "state is required" }),
  zipCode: z.string().optional(),

  // Academic Info
  admissionNumber: z
    .string()
    .min(1, { message: "Admission number is required" }),
  gradeId: z.string().min(1, { message: "student's grade is required" }),
  streamId: z.string().min(1, { message: "stream is required" }),
  enrollmentDate: z.string().min(1, { message: "Enrollment date is required" }),
  password: z.string().min(1, "Student password is required"),

  // Optional
  message: z.string().optional(),
});

export type StudentEnrollmentTypes = z.infer<typeof StudentEnrollmentSchema>;

//teacher enrollment
export const TeacherEnrollmentSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  alternatePhone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),

  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(10, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Relationship is required"),

  // Professional Information
  highestQualification: z.string().min(1, "Highest qualification is required"),
  specialization: z.string().min(1, "Specialization is required"),
  teachingExperience: z.string().min(1, "Teaching experience is required"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  gradesCanTeach: z.array(z.string()).min(1, "Select at least one grade"),

  // Employment Details
  employmentType: z.enum(["full_time", "part_time", "contract"], {
    required_error: "Please select employment type",
  }),
  joiningDate: z.date({
    required_error: "Joining date is required",
  }),
  position: z.string().min(1, "Position is required"),
  departmentId: z.string().min(1, "Department is required"),

  // Previous Employment
  previousEmployments: z.array(
    z.object({
      institution: z.string().min(1, "Institution name is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.date({ required_error: "Start date is required" }),
      endDate: z.date({
        required_error: "End date is required",
      }),
      reasonForLeaving: z.string().min(1, "reason for leaving is required"),
    }),
  ),

  // Additional Information
  certifications: z.string().optional(),
  skills: z.string().optional(),
  languages: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type TeacherEnrollmentType = z.infer<typeof TeacherEnrollmentSchema>;

//class creation
export const StreamCreationSchema = z.object({
  name: z.string().min(1, { message: "Class name is required" }),
  teacherId: z.string().optional(),
  gradeId: z.string().min(1, "A grade is required"),
});

export type StreamCreationTYpes = z.infer<typeof StreamCreationSchema>;

//grade creation
export const GradeCreationSchema = z.object({
  name: z.string().min(1, { message: "Grade name is required" }),
});

export type GradeCreationTYpes = z.infer<typeof StreamCreationSchema>;

//parents enrollment schema
export const ParentsEnrollmentSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  occupation: z.string().optional().or(z.literal("")),
  dateOfBirth: z.date().optional(),
  educationLevel: z.string().optional().or(z.literal("")),
  preferredContactMethod: z.enum(["phone", "email", "both"]).default("both"),
  notes: z.string().optional().or(z.literal("")),
});

export type ParentsEnrollmentType = z.infer<typeof ParentsEnrollmentSchema>;

//department creation schema
export const DepartmentCreationSchema = z.object({
  name: z.string().min(1, { message: "Department name is required" }),
  description: z.string().optional(),
});

export type DepartmentTypes = z.infer<typeof DepartmentCreationSchema>;

// subject creation schema
export const subjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortname: z.string().min(1, "Short Name is required"),
  subjectCode: z.string().min(1, "Subject Code is required"),
  departmentId: z.string().min(1, "Department is required"),

  active: z
    .union([z.literal("on"), z.null(), z.undefined()])
    .transform((val) => val === "on"),
  optional: z
    .union([z.literal("on"), z.null(), z.undefined()])
    .transform((val) => val === "on"),
  fieldtrips: z
    .union([z.literal("on"), z.null(), z.undefined()])
    .transform((val) => val === "on"),
  labRequired: z
    .union([z.literal("on"), z.null(), z.undefined()])
    .transform((val) => val === "on"),
});

//lesson creation schema
export const lessonSchema = z.object({
  name: z.string().min(1, "Lesson name is required"),
  description: z.string().optional(),
  materials: z.any().optional(), // or use z.record(z.any()) if it's expected to be an object
  assignment: z.any().optional(), // same here
  day: z.string(),
  teacherId: z.string().min(1, "Teacher is required"),
  subjectId: z.string().min(1, "Subject  is required"),
  streamId: z.string().min(1, "Stream  is required"),
  timeSlotId: z.string().min(1, "time Slot is required"),
});

// time slot creation schema

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TimeSlotSchema = z.object({
  name: z.string().min(1, "Time slot name is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export type TimeSlotTYpes = z.infer<typeof TimeSlotSchema>;
