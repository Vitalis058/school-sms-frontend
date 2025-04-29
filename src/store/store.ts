"use client";
import { configureStore } from "@reduxjs/toolkit";
import teacherSlice from "./../features/teacher/slice";
import gradeSlice from "./../features/grade/slice";
import streamSlice from "./../features/stream/slice";
import subjectSlice from "./../features/subject/slice";
import departmentSlice from "./../features/department/slice";
import parentSlice from "./../features/parent/slice";

export const store = configureStore({
  reducer: {
    teachers: teacherSlice,
    grades: gradeSlice,
    subjects: subjectSlice,
    streams: streamSlice,
    department: departmentSlice,
    parents: parentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
