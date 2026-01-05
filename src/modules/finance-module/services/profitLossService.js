import axiosInstance from "@/services/axiosInstance";
import { storeProfitLossReportData } from "../store/profitLossSlice";
import { format } from "date-fns";

/**
 * Fetch profit and loss report
 */
const getProfitLossReport = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  companyId,
  departmentId
) => {
  const queryParams = new URLSearchParams();

  // If fromDate and toDate are not provided, default to year-to-date
  if (!fromDate || !toDate) {
    toDate = new Date();
    fromDate = new Date(toDate.getFullYear(), 0, 1); // Jan 1st of current year
  }

  // Append query parameters
  queryParams.append("fromDate", format(fromDate, "yyyy-MM-dd"));
  queryParams.append("toDate", format(toDate, "yyyy-MM-dd"));
  if (companyId) queryParams.append("company", companyId);
  if (departmentId) queryParams.append("department", departmentId);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/reports/annual-profit-and-loss/?${queryParams.toString()}`,
    });

    dispatch(storeProfitLossReportData(res.data)); // Store transactions in Redux store
  } catch {
    // Error is shown via Axios Instance interceptor
  }
};

export { getProfitLossReport };
