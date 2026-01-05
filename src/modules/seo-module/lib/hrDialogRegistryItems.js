import AddCandidateToPool from "../components/candidates/AddCandidateToPool";
import AddNewJobPostForm from "../components/jobs/AddNewJobPostForm";
import ArchiveJobPostAlert from "../components/jobs/ArchiveJobPostAlert";
import EditJobPostForm from "../components/jobs/EditJobPostForm";
import GenerateLink from "../components/jobs/GenerateLink";
import CandidateNumbereMethodologyResult from "../components/number-methodology/CandidateNumberMethodologyResult";
import EditTaskChecklist from "../components/onboarding-task-checklist/EditTaskChecklist";
import AddEditDiscQuestionForm from "../components/personality-tests/disc-test/AddEditDiscQuestionForm";
import ArchiveDiscQuestionAlert from "../components/personality-tests/disc-test/ArchiveDiscQuestionAlert";
import GenerateDiscLink from "../components/personality-tests/disc-test/GenerateDiscTestLink";
import AddEditReferralForm from "../components/referrals/AddEditReferralForm";
import ArchiveReferralAlert from "../components/referrals/ArchiveReferralAlert";
import AddNewHiringForm from "../components/vacancies/AddNewHiringForm";
import RejectVacanyAlert from "../components/vacancies/RejectVacancyAlert";
import VacancyDetailedView from "../components/vacancies/VacancyDetailedView";
import ViewVacancyRejectComment from "../components/vacancies/ViewVacancyComment";

const hrDialogRegistryItems = {
  // HR - Hiring Vacancy
  addVacancy: AddNewHiringForm,
  rejectVacancy: RejectVacanyAlert,
  viewVacancyComment: ViewVacancyRejectComment,
  vacancyDetails: VacancyDetailedView,

  // Job Postings
  addNewJobPosting: AddNewJobPostForm,
  editjobPosting: EditJobPostForm,
  generateLink: GenerateLink,
  archivejobPosting: ArchiveJobPostAlert,

  // Candidates
  addToBlacklistPool: AddCandidateToPool,
  addToWhitelistPool: AddCandidateToPool,

  // Referrals
  addNewReferral: AddEditReferralForm,
  editReferral: AddEditReferralForm,
  archiveReferral: ArchiveReferralAlert,

  // DISC Test
  addNewDiscQuestion: AddEditDiscQuestionForm,
  editDiscQuestion: AddEditDiscQuestionForm,
  archiveDiscQuestion: ArchiveDiscQuestionAlert,
  generateDiscLink: GenerateDiscLink,

  // Number Methodology
  candidateNumberMethodologyResult: CandidateNumbereMethodologyResult,

  editTaskChecklist: EditTaskChecklist,
};

export default hrDialogRegistryItems;
