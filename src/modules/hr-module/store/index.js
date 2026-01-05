import attendanceTrackingReducer from "./attendanceTrackingSlice";
import candidatesReducer from "./candidatesSlice";
import employeeDatabaseReducer from "./employeeDatabaseSlice";
import hiringVacancyReducer from "./hiringVacancySlice";
import jobsReducer from "./jobsSlice";
import leaveManagementReducer from "./leaveManagementSlice";
import onboardingTaskChecklistReducer from "./onboardingTaskChecklistSlice";
import personalityTestReducer from "./personalityTestSlice";
import referralsReducer from "./personalityTestSlice";

const hrReducers = {
  onboardingTaskChecklist: onboardingTaskChecklistReducer,
  employeeDatabase: employeeDatabaseReducer,
  attendanceTracking: attendanceTrackingReducer,
  leaveManagement: leaveManagementReducer,

  hiringVacancy: hiringVacancyReducer,
  jobs: jobsReducer,
  candidates: candidatesReducer,
  referrals: referralsReducer,
  personalityTest: personalityTestReducer,
};

export default hrReducers;
