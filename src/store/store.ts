"use client";
import { configureStore } from "@reduxjs/toolkit";
import departmentSlice from "./../features/department/slice";
import gradeSlice from "./../features/grade/slice";
import timeSlotSlice from "./../features/lessons/slice";
import parentSlice from "./../features/parent/slice";
import streamSlice from "./../features/stream/slice";
import subjectSlice from "./../features/subject/slice";
import teacherSlice from "./../features/teacher/slice";

export const store = configureStore({
  reducer: {
    teachers: teacherSlice,
    grades: gradeSlice,
    subjects: subjectSlice,
    streams: streamSlice,
    department: departmentSlice,
    parents: parentSlice,
    timeSlots: timeSlotSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
