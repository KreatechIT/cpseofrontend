import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Reducers
import authReducer, {
  removeAuthData,
} from "@/modules/auth-module/store/authSlice";

import uiReducer from "@/store/reducers/uiSlice";
import dialogReducer from "@/store/reducers/dialogSlice";
import sheetReducer from "@/store/reducers/sheetSlice";

import adminReducers from "@/modules/admin-module/store";
import memberReducers from "@/modules/member-module/store";
import financeReducers from "@/modules/finance-module/store";
import hrReducers from "@/modules/hr-module/store";
import projectSlice from "@/modules/seo-module/store/projectSlice";
import vendorReducer from "@/modules/seo-module/store/vendorSlice";
import samplePoolReducer from "@/modules/seo-module/store/samplePoolSlice";
import orderSlice from "@/modules/seo-module/store/orderSlice";
import purchasedPoolReducer from "@/modules/seo-module/store/purchasedPoolSlice";
import competitorPoolReducer from "@/modules/seo-module/store/competitorPoolSlice";
import competitorDetailsReducer from "@/modules/seo-module/store/competitorDetailsSlice";
import ahrefsImportReducer from "@/modules/seo-module/store/ahrefsImportSlice";
import orderImportReducer from "@/modules/seo-module/store/orderImportSlice";
import analyticsImportReducer from "@/modules/seo-module/store/analyticsImportSlice";
import searchConsoleImportReducer from "@/modules/seo-module/store/searchConsoleImportSlice";
import conversionImportReducer from "@/modules/seo-module/store/conversionImportSlice";
import seRankingImportReducer from "@/modules/seo-module/store/seRankingImportSlice";
import seoDashboardReducer from "@/modules/seo-module/store/seoDashboardSlice";
import insightReducer from "@/modules/seo-module/store/insightSlice";
import issueOverviewImportReducer from "@/modules/seo-module/store/issueOverviewImportSlice";
import dailyRecordImportReducer from "@/modules/seo-module/store/dailyRecordImportSlice";
import testScenarioReducer from "@/modules/seo-module/store/testScenarioSlice";
// Redux Persist Configuration
const persistConfig = {
  key: "root", // Key for localStorage
  version: 1,
  storage,
  whitelist: ["auth"], // ONLY 'auth' slice will be persisted
};

// Root Reducer with Logout Reset Functionality
const combinedReducer = combineReducers({
  auth: authReducer,

  ui: uiReducer,
  dialog: dialogReducer,
  sheet: sheetReducer,

  ...adminReducers,
  ...memberReducers,
  ...financeReducers,
  ...hrReducers,
  projects: projectSlice,
  vendorDatabase: vendorReducer,
  samplePool: samplePoolReducer,
  orderManagement: orderSlice,
  purchasedPool: purchasedPoolReducer,
  competitorPool: competitorPoolReducer,
  competitorDetails: competitorDetailsReducer,
  ahrefsImport: ahrefsImportReducer,
  orderImport: orderImportReducer,
  analyticsImport: analyticsImportReducer,
  searchConsoleImport: searchConsoleImportReducer,
  conversionImport: conversionImportReducer,
  seRankingImport: seRankingImportReducer,
  seoDashboard: seoDashboardReducer,
  insight: insightReducer,
  issueOverviewImport: issueOverviewImportReducer,
  dailyRecordImport: dailyRecordImportReducer,
  testScenario: testScenarioReducer,
  // Add other feature reducers here
});

// Create a root reducer that resets state on logout
const rootReducer = (state, action) => {
  if (action.type === removeAuthData.type) {
    const newState = undefined; // Force all reducers to reset to their initial state
    return combinedReducer(newState, action);
  }
  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist for serializability check
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE !== "production", // Enable DevTools only in development
});

export const persistor = persistStore(store); // Export the persistor
export default store;
