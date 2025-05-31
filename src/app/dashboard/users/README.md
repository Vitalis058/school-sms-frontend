# User Management - Teacher & Parent Enrollment Forms

This directory contains enhanced enrollment forms for teachers and parents/guardians in the school management system. Both forms feature modern, multi-step interfaces with comprehensive validation, draft saving, and improved user experience.

## Overview

The enrollment forms have been completely redesigned with:
- **Multi-step wizard interface** with progress tracking
- **Enhanced validation** with real-time error feedback
- **Draft saving/loading** functionality
- **Photo upload** capabilities
- **Responsive design** with mobile-friendly layouts
- **Step navigation** with completion tracking
- **Professional UI** with consistent design patterns

## Features

### 🧑‍🏫 Teacher Enrollment Form (`/dashboard/users/teachers/new`)

#### Multi-Step Process
1. **Personal Information** - Basic details and contact information
2. **Address & Emergency Contact** - Residential and emergency contact details
3. **Professional Information** - Educational qualifications and teaching expertise
4. **Current Employment** - Employment type, position, and department
5. **Previous Employment** - Work history and experience (optional)
6. **Additional Information** - Certifications, skills, and notes (optional)
7. **Review & Submit** - Final review before submission

#### Key Features
- **Photo Upload**: Profile picture with validation (max 5MB, image files only)
- **Dynamic Form Validation**: Real-time validation with step-by-step error checking
- **Previous Employment Management**: Add/remove multiple employment records
- **Subject & Department Integration**: Dropdown selections from existing data
- **Draft Management**: Save and load form drafts using localStorage
- **Step Navigation**: Click to navigate between completed steps
- **Progress Tracking**: Visual progress bar and completion indicators
- **Error Handling**: Comprehensive error display with specific field validation

#### Technical Implementation
- **Form Library**: React Hook Form with Zod validation
- **State Management**: Local state with completion tracking
- **API Integration**: RTK Query for departments and subjects
- **File Handling**: Client-side photo preview and validation
- **Responsive Design**: Grid layout with sidebar navigation

### 👨‍👩‍👧‍👦 Parent Enrollment Form (`/dashboard/users/parents/new`)

#### Multi-Step Process
1. **Basic Information** - Personal details and relationship information
2. **Contact Details** - Phone, email, and address information
3. **Professional Info** - Occupation and education details (optional)
4. **Additional Details** - Preferences and additional notes (optional)
5. **Review & Submit** - Final review with summary cards

#### Key Features
- **Enhanced Photo Upload**: Improved photo handling with remove functionality
- **Relationship Validation**: Specific validation for parent-student relationships
- **Contact Method Preferences**: Configurable communication preferences
- **Professional Information**: Optional occupation and education tracking
- **Review Summary**: Organized review with categorized information cards
- **Draft Persistence**: Save/load functionality with photo preview storage
- **Improved Validation**: Step-specific validation with clear error messages
- **Success/Error Handling**: Enhanced feedback with dismissible alerts

#### Technical Implementation
- **Server Actions**: Next.js server actions for form submission
- **Enhanced Validation**: Multi-step validation with field-specific rules
- **Photo Management**: File validation, preview, and removal functionality
- **Local Storage**: Draft persistence with photo preview handling
- **Responsive Cards**: Review step with organized information display

## Technical Architecture

### Form Structure
```
src/app/dashboard/users/
├── teachers/
│   └── new/
│       └── page.tsx          # Enhanced teacher enrollment form
└── parents/
    └── new/
        └── page.tsx          # Enhanced parent enrollment form
```

### Supporting Components
```
src/features/
├── teacher/
│   └── forms/
│       ├── PersonalInfo.tsx
│       ├── AddressInfo.tsx
│       ├── ProfessionalInfo.tsx
│       ├── CurrentEmploymentDetails.tsx
│       ├── PreviousEmployment.tsx
│       ├── AdditionalInfo.tsx
│       └── ReviewInfo.tsx
└── parent/
    ├── actions/
    │   └── parent_actions.ts
    └── components/
```

### Validation Schemas
```typescript
// Teacher Enrollment Schema
export const TeacherEnrollmentSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  // ... additional fields
});

// Parent Enrollment Schema
export const ParentsEnrollmentSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  // ... additional fields
});
```

## Usage Guide

### Teacher Enrollment Process

1. **Access the Form**
   ```
   Navigate to: /dashboard/users/teachers/new
   ```

2. **Complete Each Step**
   - Fill required fields (marked with *)
   - Upload profile photo (optional)
   - Add previous employment records as needed
   - Review all information before submission

3. **Draft Management**
   - Click "Save Draft" to save progress
   - Click "Load Draft" to restore saved data
   - Drafts are automatically cleared on successful submission

4. **Navigation**
   - Use "Next/Previous" buttons for sequential navigation
   - Click step buttons in sidebar to jump to completed steps
   - Progress bar shows overall completion status

### Parent Enrollment Process

1. **Access the Form**
   ```
   Navigate to: /dashboard/users/parents/new
   ```

2. **Step-by-Step Completion**
   - **Basic Info**: Name, relationship, date of birth
   - **Contact**: Phone (required), email, address, contact preferences
   - **Professional**: Occupation and education (optional)
   - **Additional**: Notes and special considerations (optional)
   - **Review**: Verify all information before submission

3. **Photo Upload**
   - Click upload area or "Upload Photo" button
   - Supports common image formats (JPG, PNG, etc.)
   - Maximum file size: 5MB
   - Click X button to remove uploaded photo

4. **Form Validation**
   - Real-time validation on field changes
   - Step-specific validation before proceeding
   - Clear error messages with specific requirements

## API Integration

### Teacher Enrollment
```typescript
// API Endpoint
POST /api/v1/teachers

// Required Data
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // ... additional teacher data
}

// Dependencies
- useGetAllDepartmentsQuery() // For department selection
- useGetAllSubjectsQuery()    // For subject selection
```

### Parent Enrollment
```typescript
// Server Action
createParentAction(data: ParentsEnrollmentType)

// Required Data
{
  name: string;
  relationship: string;
  phone: string;
  address: string;
  // ... additional parent data
}
```

## Validation Rules

### Teacher Form Validation
- **Personal Info**: All fields required except alternate phone
- **Address**: Complete address information required
- **Professional**: At least one subject and grade level required
- **Employment**: Department and position required
- **Previous Employment**: Optional, but if added, all fields required
- **Additional Info**: All optional

### Parent Form Validation
- **Basic Info**: Name and relationship required, date of birth optional
- **Contact**: Phone and address required, email optional
- **Professional**: All optional
- **Additional**: All optional

## Error Handling

### Client-Side Validation
- Real-time field validation
- Step-specific validation before proceeding
- Comprehensive error collection and display
- User-friendly error messages

### Server-Side Validation
- Schema validation on submission
- Detailed error responses
- Graceful error handling with user feedback

### Photo Upload Validation
- File type validation (images only)
- File size validation (max 5MB)
- Preview generation and error handling

## Responsive Design

### Desktop Layout
- Sidebar navigation with step indicators
- Main content area with form fields
- Progress tracking and completion status
- Draft management controls

### Mobile Layout
- Stacked layout for smaller screens
- Touch-friendly navigation buttons
- Optimized form field spacing
- Responsive photo upload area

## Performance Optimizations

### Form Performance
- React Hook Form for efficient re-renders
- Zod validation for type safety
- Lazy loading of form steps
- Optimized state management

### Data Loading
- RTK Query for efficient API calls
- Automatic caching and invalidation
- Loading states and error boundaries
- Background data fetching

### User Experience
- Smooth transitions between steps
- Auto-save draft functionality
- Progress persistence across sessions
- Intuitive navigation patterns

## Accessibility Features

### Keyboard Navigation
- Tab order optimization
- Keyboard shortcuts for navigation
- Focus management between steps
- Screen reader compatibility

### Visual Accessibility
- High contrast design elements
- Clear visual hierarchy
- Consistent iconography
- Readable typography

### Form Accessibility
- Proper label associations
- Error message announcements
- Required field indicators
- Descriptive help text

## Future Enhancements

### Planned Features
- **Bulk Import**: CSV/Excel import for multiple records
- **Advanced Photo Editing**: Crop and resize functionality
- **Email Verification**: Automatic email validation
- **SMS Verification**: Phone number verification
- **Document Upload**: Support for certificates and documents
- **Integration APIs**: Third-party service integrations

### Technical Improvements
- **Real-time Collaboration**: Multiple users editing simultaneously
- **Advanced Validation**: Custom validation rules
- **Audit Trail**: Track form changes and submissions
- **Analytics**: Form completion and abandonment tracking
- **Offline Support**: Progressive Web App capabilities

## Troubleshooting

### Common Issues

#### Form Not Saving
- Check network connectivity
- Verify user permissions
- Clear browser cache
- Check console for errors

#### Photo Upload Failing
- Verify file size (max 5MB)
- Check file format (images only)
- Ensure stable internet connection
- Try different image file

#### Validation Errors
- Check required field completion
- Verify email format
- Ensure phone number format
- Review date selections

#### Draft Not Loading
- Check localStorage availability
- Verify browser settings
- Clear and re-save draft
- Check for data corruption

### Debug Mode
Enable debug mode by opening browser developer tools and checking the console for detailed error messages and validation feedback.

## Support

For technical support or questions about the enrollment forms:
- Check the browser console for error messages
- Verify all required fields are completed
- Ensure proper file formats for uploads
- Contact system administrator for permission issues

## Contributing

When contributing to the enrollment forms:
1. Follow existing code patterns and structure
2. Maintain accessibility standards
3. Test across different devices and browsers
4. Update documentation for new features
5. Ensure proper validation and error handling 