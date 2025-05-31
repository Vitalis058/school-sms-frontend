"use client";

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import base API with all injected endpoints
import { baseApi } from "./api/baseApi";

// Import legacy schoolApi for backward compatibility
import { schoolApi } from "../redux/services";

// Import all API slices to ensure endpoints are injected
import "./api/academicsApi";
import "./api/authApi";
import "./api/studentApi";
import "./api/teacherApi";
import "./api/parentApi";
import "./api/administrationApi";
import "./api/communicationApi";
import "./api/financeApi";
import "./api/resourcesApi";
import "./api/reportsApi";
import "./api/transportApi";
import "./api/libraryApi";
import "../features/attendance/api/attendanceApi";

// Create the store
export const store = configureStore({
  reducer: {
    // Use the base API reducer
    [baseApi.reducerPath]: baseApi.reducer,
    // Add legacy schoolApi reducer for backward compatibility
    [schoolApi.reducerPath]: schoolApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
        ],
      },
    }).concat([
      // Add base API middleware
      baseApi.middleware,
      // Add legacy schoolApi middleware for backward compatibility
      schoolApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup listeners for automatic refetching
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; 