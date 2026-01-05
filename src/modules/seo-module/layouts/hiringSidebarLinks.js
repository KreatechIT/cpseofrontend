import { CreditCardIcon } from "@/components/icons/FinanceIcons";
import {
  HiringApplicantProcessIcon,
  HrManagementIcon,
  NumbersMethodologyIcon,
  PersonalityTestSettingsIcon,
  RecruitmentProcessIcon,
  TalentPoolIcon,
} from "@/components/icons/HrIcons";
import { DashboardIcon, SettingsIcon } from "@/components/icons/Icons";
import { UserAccessManagementIcon } from "@/components/icons/Icons";

const hiringSidebarLinks = [
  {
    groupTitle: null,
    hasPermission: () => true,
    children: [
      {
        title: "Dashboard",
        path: "/hr/hiring-management/dashboard",
        icon: DashboardIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "Hiring Applicant Process",
        path: "/hr/hiring-management/vacancy",
        icon: HiringApplicantProcessIcon,
        hasPermission: ({ hasPermission }) =>
          hasPermission("hr_hiring_vacancy.read"),
        children: null,
      },
      {
        title: "Recruitment Process",
        path: "/hr/hiring-management/recruitment",
        icon: RecruitmentProcessIcon,
        hasPermission: () => true,
        children: [
          {
            title: "Jobs",
            path: "/hr/hiring-management/recruitment/jobs",
            hasPermission: ({ hasPermission }) =>
              hasPermission("hr_job_posting.read"),
            children: null,
            content: null,
          },
          {
            title: "Candidates",
            path: "/hr/hiring-management/recruitment/candidates",
            hasPermission: ({ hasPermission }) =>
              hasPermission("hr_job_candidate.read"),
            children: null,
          },
          {
            title: "Referrals",
            path: "/hr/hiring-management/recruitment/referrals",
            hasPermission: ({ hasPermission }) =>
              hasPermission("hr_referral.read"),
            children: null,
          },
        ],
      },
      {
        title: "Talent Pool",
        path: "/hr/hiring-management/talent-pool",
        icon: TalentPoolIcon,
        hasPermission: ({ hasAnyPermission }) =>
          hasAnyPermission([
            "hr_talent_pool.read_whitelist",
            "hr_talent_pool.read_blacklist",
          ]),
        children: [
          {
            title: "Whitelist Pool",
            path: "/hr/hiring-management/talent-pool/whitelist",
            hasPermission: ({ hasPermission }) =>
              hasPermission("hr_talent_pool.read_whitelist"),
            children: null,
          },
          {
            title: "Blacklist Pool",
            path: "/hr/hiring-management/talent-pool/blacklist",
            hasPermission: ({ hasPermission }) =>
              hasPermission("hr_talent_pool.read_blacklist"),
            children: null,
          },
        ],
      },
      {
        title: "Personality Test Settings",
        path: "/hr/hiring-management/personality-test-settings/",
        icon: PersonalityTestSettingsIcon,
        hasPermission: () => true,
        children: [
          {
            title: "DISC Settings",
            path: "/hr/hiring-management/personality-test-settings/disc-settings",
            hasPermission: ({ hasPermission }) =>
              hasPermission("hr_disc_questions.read"),
            children: null,
          },
          {
            title: "MBTI Settings",
            path: "/hr/hiring-management/personality-test-settings/mbti-settings",
            hasPermission: () => true,
            children: null,
          },
        ],
      },
      {
        title: "Numbers Methodology",
        path: "/hr/hiring-management/numbers-methodology/",
        icon: NumbersMethodologyIcon,
        hasPermission: () => true,
      },
    ],
  },

  {
    groupTitle: "Other Links",
    hasPermission: () => true,
    children: [
      {
        title: "User Access Management",
        path: "/organisation/dashboard",
        icon: UserAccessManagementIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "Finance Management",
        path: "/finance/dashboard?from=hr",
        icon: CreditCardIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "HR Management",
        path: "/hr/hr-management/dashboard?from=hiring",
        icon: HrManagementIcon,
        hasPermission: () => true,
      },
      {
        title: "Settings",
        path: "/settings",
        icon: SettingsIcon,
        hasPermission: () => true,
        children: null,
      },
    ],
  },
];

export default hiringSidebarLinks;
