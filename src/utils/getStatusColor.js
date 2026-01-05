export const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "bg-[#FFEFBA] ";
    case "Pending":
      return "bg-[#FFEFBA] dark:text-black";
    case "Processing":
      return "bg-blue-100 dark:bg-blue-200 text-blue-800";
    case "Approved":
      return "bg-green-100 dark:bg-green-200 text-green-900";
    case "Rejected":
      return "bg-red-100 dark:bg-red-200 text-red-800";
    default:
      return "bg-gray-200 dark:bg-gray-300";
  }
};

export const getCandidateStatusColor = (status) => {
  switch (status) {
    case "New":
      return "bg-yellow-100 dark:bg-yellow-200 text-yellow-800";
    case "Scheduled":
      return "bg-blue-100 dark:bg-blue-200 text-blue-800";
    case "Interviewed":
      return "bg-indigo-100 dark:bg-indigo-200 text-indigo-800";
    case "Offered":
      return "bg-purple-100 dark:bg-purple-200 text-purple-800";
    case "Hired":
      return "bg-green-100 dark:bg-green-200 text-green-900";
    case "Rejected":
      return "bg-red-100 dark:bg-red-200 text-red-800";
    case "Blacklisted":
      return "bg-red-100 dark:bg-red-200 text-red-800";
    default:
      return "bg-gray-200 dark:bg-gray-300 text-gray-800";
  }
};

export const getJobStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 dark:bg-green-200 text-green-800";
    case "Completed":
      return "bg-blue-100 dark:bg-blue-200 text-blue-800";
    case "Cancelled":
      return "bg-red-100 dark:bg-red-200 text-red-800";
    case "Draft":
      return "bg-gray-100 dark:bg-gray-200 text-gray-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};
