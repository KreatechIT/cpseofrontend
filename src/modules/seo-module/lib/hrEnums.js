const JOB_TYPE_CHOICES = [
  { label: "Full Time", value: "1" },
  { label: "Part Time", value: "2" },
  { label: "Internship", value: "3" },
];

const SALARY_CHOICES = [
  { label: "< 2,000", value: "1" },
  { label: "2,000 - 2,999", value: "2" },
  { label: "3,000 - 3,999", value: "3" },
  { label: "4,000 - 4,999", value: "4" },
  { label: "5,000 - 5,999", value: "5" },
  { label: "6,000 - 6,999", value: "6" },
  { label: "7,000 - 7,999", value: "7" },
  { label: "8,000 - 8,999", value: "8" },
  { label: "9,000 - 9,999", value: "9" },
  { label: "> 9,999", value: "10" },
];

const GENDER_CHOICES = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "99", label: "Others" },
];

const MARITAL_STATUS_CHOICES = [
  { value: "1", label: "Single" },
  { value: "2", label: "Married" },
  { value: "3", label: "Divorced" },
  { value: "4", label: "Widowed" },
  { value: "5", label: "Separated" },
  { value: "6", label: "Engaged" },
  { value: "7", label: "In a Relationship" },
  { value: "99", label: "Others" },
];

const RACE_CHOICES = [
  { value: "1", label: "Malay" },
  { value: "2", label: "Chinese" },
  { value: "3", label: "Indian" },
  { value: "99", label: "Others" },
];

const RELIGION_CHOICES = [
  { value: "1", label: "Islam" },
  { value: "2", label: "Buddhism" },
  { value: "3", label: "Christianity" },
  { value: "4", label: "Hinduism" },
  { value: "5", label: "Sikhism" },
  { value: "6", label: "Taoism" },
  { value: "7", label: "Confucianism" },
  { value: "8", label: "Animism / Traditional Beliefs" },
  { value: "9", label: "Atheism / Non-religious" },
  { value: "99", label: "Others" },
];

const NATIONALITY_CHOICES = [
  { value: "1", label: "Malaysian" },
  { value: "99", label: "Others" },
];

const HR_CANDIDATE_STATUS_CHOICES = [
  { value: "1", label: "New" },
  { value: "2", label: "Scheduled" },
  { value: "3", label: "Interviewed" },
  { value: "4", label: "Offered" },
  { value: "5", label: "Hired" },
  { value: "6", label: "Rejected" },
];

const JOB_STATUS_CHOICES = [
  { value: "1", label: "Active" },
  { value: "2", label: "Completed" },
  { value: "3", label: "Cancelled" },
  { value: "4", label: "Draft" },
];

const DISC_PERSONALITY_ENUM = [
  { value: "1", label: "D" },
  { value: "2", label: "I" },
  { value: "3", label: "S" },
  { value: "4", label: "C" },
];

export {
  JOB_TYPE_CHOICES,
  SALARY_CHOICES,
  HR_CANDIDATE_STATUS_CHOICES,
  GENDER_CHOICES,
  MARITAL_STATUS_CHOICES,
  RACE_CHOICES,
  RELIGION_CHOICES,
  NATIONALITY_CHOICES,
  JOB_STATUS_CHOICES,
  DISC_PERSONALITY_ENUM,
};
