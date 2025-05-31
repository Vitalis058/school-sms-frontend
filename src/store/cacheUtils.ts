// Cache invalidation utilities for RTK Query
// This file provides centralized cache invalidation strategies

export type CacheTag = 
  | "Student"
  | "Teacher" 
  | "Parent"
  | "Department"
  | "Subject"
  | "Grade"
  | "Stream"
  | "Lesson"
  | "TimeSlot"
  | "User"
  | "Attendance"
  | "Fee"
  | "Communication"
  | "Report"
  | "Asset"
  | "Route";

export type EntityTag = { type: CacheTag; id: string };

// Comprehensive cache invalidation patterns
export const cacheInvalidationPatterns = {
  // When student data changes
  student: ["Student", "Grade", "Stream", "Parent", "Attendance"] as CacheTag[],
  
  // When teacher data changes
  teacher: ["Teacher", "Department", "Subject", "Lesson", "Stream", "Attendance"] as CacheTag[],
  
  // When parent data changes
  parent: ["Parent", "Student", "Communication"] as CacheTag[],
  
  // When academic structure changes
  grade: ["Grade", "Stream", "Student"] as CacheTag[],
  stream: ["Stream", "Grade", "Student", "Teacher"] as CacheTag[],
  department: ["Department", "Subject", "Teacher"] as CacheTag[],
  subject: ["Subject", "Department", "Teacher", "Lesson"] as CacheTag[],
  
  // When schedule changes
  timeSlot: ["TimeSlot", "Lesson"] as CacheTag[],
  lesson: ["Lesson", "TimeSlot", "Teacher", "Subject", "Stream"] as CacheTag[],
  
  // When attendance changes
  attendance: ["Attendance", "Student", "Teacher"] as CacheTag[],
};

// Helper to get comprehensive invalidation tags for an entity
export function getInvalidationTags(
  entityType: keyof typeof cacheInvalidationPatterns,
  entityId?: string
): (CacheTag | EntityTag)[] {
  const tags = cacheInvalidationPatterns[entityType];
  const result: (CacheTag | EntityTag)[] = [...tags];
  
  if (entityId) {
    // Add specific entity tag
    result.unshift({ type: entityType.charAt(0).toUpperCase() + entityType.slice(1) as CacheTag, id: entityId });
  }
  
  return result;
}

// Helper for bulk operations that affect multiple entities
export function getBulkInvalidationTags(entityTypes: (keyof typeof cacheInvalidationPatterns)[]): CacheTag[] {
  const allTags = new Set<CacheTag>();
  
  entityTypes.forEach(entityType => {
    cacheInvalidationPatterns[entityType].forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags);
}

// Optimistic update helpers
export function createOptimisticUpdate<T>(entityType: CacheTag, newEntity: T) {
  return {
    type: 'optimistic' as const,
    entityType,
    newEntity,
  };
}

export function removeOptimisticUpdate<T>(entityType: CacheTag, entityId: string) {
  return {
    type: 'remove' as const,
    entityType,
    entityId,
  };
} 