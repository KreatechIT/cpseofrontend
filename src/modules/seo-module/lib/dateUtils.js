import { format, parse } from "date-fns";

/**
 * Centralized date formatting utilities for SEO module
 * 
 * Date Format Standards:
 * - Long format (display): DD/MM/YYYY (e.g., "24/03/2026")
 * - Short format (display): MMM YYYY (e.g., "JAN 2025" or "Jan 2025")
 * - API format: yyyy-MM-dd (e.g., "2026-03-24")
 */

/**
 * Format date for API submission (yyyy-MM-dd)
 * Handles multiple input formats from Excel:
 * - DD/MM/YYYY (e.g., "24/03/2026")
 * - MM/DD/YYYY (e.g., "03/24/2026")
 * - yyyy-MM-dd (e.g., "2026-03-24")
 * - Date objects
 * - Short month format (e.g., "JAN 2025", "Jan 2025")
 */
export const formatDateForAPI = (dateInput) => {
  if (!dateInput) return null;

  let date;

  if (typeof dateInput === "string") {
    const cleanStr = dateInput.trim();
    
    // Handle short month format: "JAN 2025" or "Jan 2025"
    const shortMonthMatch = cleanStr.match(/^([A-Za-z]{3})\s+(\d{4})$/i);
    if (shortMonthMatch) {
      const [, monthStr, yearStr] = shortMonthMatch;
      // Parse as first day of the month
      date = parse(`${monthStr} ${yearStr}`, "MMM yyyy", new Date());
      if (!isNaN(date.getTime())) {
        return format(date, "yyyy-MM-dd");
      }
    }

    // Handle DD/MM/YYYY format (common in Excel exports)
    const ddmmyyyyMatch = cleanStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (ddmmyyyyMatch) {
      let [, day, month, year] = ddmmyyyyMatch.map(Number);
      year = year < 100 ? 2000 + year : year;
      date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return format(date, "yyyy-MM-dd");
      }
    }

    // Handle yyyy-MM-dd format (ISO format)
    const isoMatch = cleanStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
      date = new Date(cleanStr);
      if (!isNaN(date.getTime())) {
        return format(date, "yyyy-MM-dd");
      }
    }

    // Fallback: try native Date parsing
    date = new Date(cleanStr);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return null;
  }

  if (isNaN(date.getTime())) return null;

  return format(date, "yyyy-MM-dd");
};

/**
 * Format date for display in long format (DD/MM/YYYY)
 */
export const formatDateLong = (dateInput) => {
  if (!dateInput) return "";
  
  const apiDate = formatDateForAPI(dateInput);
  if (!apiDate) return "";
  
  const date = new Date(apiDate);
  if (isNaN(date.getTime())) return "";
  
  return format(date, "dd/MM/yyyy");
};

/**
 * Format date for display in short format (MMM YYYY)
 * @param {string|Date} dateInput - Date to format
 * @param {boolean} uppercase - Whether to return uppercase (default: false)
 */
export const formatDateShort = (dateInput, uppercase = false) => {
  if (!dateInput) return "";
  
  const apiDate = formatDateForAPI(dateInput);
  if (!apiDate) return "";
  
  const date = new Date(apiDate);
  if (isNaN(date.getTime())) return "";
  
  const formatted = format(date, "MMM yyyy");
  return uppercase ? formatted.toUpperCase() : formatted;
};

/**
 * Parse short month format from Excel (e.g., "JAN 2025", "SEP 2025")
 * Returns Date object set to first day of the month
 */
export const parseShortMonth = (monthYearStr) => {
  if (!monthYearStr) return null;
  
  const cleanStr = monthYearStr.trim();
  const match = cleanStr.match(/^([A-Za-z]{3})\s+(\d{4})$/i);
  
  if (!match) return null;
  
  const [, monthStr, yearStr] = match;
  const date = parse(`${monthStr} ${yearStr}`, "MMM yyyy", new Date());
  
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Safe date formatting with fallback
 */
export const safeFormatDate = (dateStr, formatStr = "dd/MM/yyyy") => {
  if (!dateStr) return "-";
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  
  try {
    return format(date, formatStr);
  } catch {
    return "-";
  }
};
