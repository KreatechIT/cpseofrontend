import AppPagination from "@/components/shared/AppPagination";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { SearchFilterInput } from "@/components/filters/SearchFilter";

import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import JobPostCardView from "./JobPostCardView";
import { cn } from "@/utils/cn";
import JobPostTableView from "./JobPostTableView";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const VacancyFilters = ({ jobPosts, onFilter }) => {
  const viewMode = useSelector((state) => state.ui.viewMode);
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState("Active");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Filter companies by search query (name or address)
  let filteredJobPosts = useMemo(() => {
    return filterBySearch(jobPosts, searchQuery, [
      "job_title",
      "company",
      "department",
      "job_type",
      "location",
      "salary",
      "application_deadline",
      "position",
      "job_requirement",
      "job_description",
    ]);
  }, [jobPosts, searchQuery]);

  filteredJobPosts = useMemo(() => {
    return filteredJobPosts.filter((job) => job.status === jobType);
  }, [filteredJobPosts, jobType]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(fromDate, toDate);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setSearchQuery("");
    setIsFilterApplied(false);

    onFilter(startDate, endDate);
  };

  // Paginate the filtered results
  const paginatedJobPosts = useMemo(() => {
    return paginate(filteredJobPosts, paginationInfo);
  }, [filteredJobPosts, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="flex justify-between items-start">
        <div className="mb-4 flex flex-grow flex-wrap items-center gap-2">
          <SearchFilterInput
            placeholder="Search by position, department, job type etc..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <DateRangeFilter
            title="Date"
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            preset={true}
          />

          {/* Apply Filters Button */}
          <FilterButton onClick={handleApplyFilters} />

          {/* Clear Filters Button (visible only if any filter is applied) */}
          {isFilterApplied && (
            <ClearFilterButton onClick={handleClearFilters} />
          )}
        </div>

        <div className="flex text-muted-foreground gap-4">
          <div
            className={cn(
              "cursor-pointer hover:border-b",
              jobType === "Active" &&
                "text-emerald-500 border-b border-emerald-500"
            )}
            onClick={() => setJobType("Active")}
          >
            Active
          </div>
          <div
            className={cn(
              "cursor-pointer hover:border-b",
              jobType === "Completed" &&
                "text-emerald-500 border-b border-emerald-500"
            )}
            onClick={() => setJobType("Completed")}
          >
            Completed
          </div>
          <div
            className={cn(
              "cursor-pointer hover:border-b",
              jobType === "Cancelled" &&
                "text-emerald-500 border-b border-emerald-500"
            )}
            onClick={() => setJobType("Cancelled")}
          >
            Cancelled
          </div>
          <div
            className={cn(
              "cursor-pointer hover:border-b",
              jobType === "Draft" &&
                "text-emerald-500 border-b border-emerald-500"
            )}
            onClick={() => setJobType("Draft")}
          >
            Draft
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <JobPostCardView filteredJobPosts={paginatedJobPosts} />
      ) : (
        <JobPostTableView filteredJobPosts={paginatedJobPosts} />
      )}

      {/* Pagination Controls */}
      {paginatedJobPosts.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredJobPosts.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredJobPosts.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default VacancyFilters;
