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
import CandidatesCardView from "./CandidatesCardView";
import CandidatesTableView from "./CandidatesTableView";
import AppPagination from "@/components/shared/AppPagination";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import SelectFilter from "@/components/filters/SelectFilter";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const CandidatesFilters = ({
  candidates,
  jobPosts,
  onFilter,
  page = "candidates",
}) => {
  const viewMode = useSelector((state) => state.ui.viewMode);
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [jobPostingId, setJobPostingId] = useState("");
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  const jobPostsOptions = useMemo(
    () => arrayToSelectOptions(jobPosts, "job_title", "id"),
    [jobPosts]
  );

  // Filter companies by search query (name or address)
  let filteredCandidates = useMemo(() => {
    return filterBySearch(candidates, searchQuery, [
      "applied_date",
      "job_title",
      "full_name",
      "first_name",
      "last_name",
      "chinese_name",
      "gender",
      "marital_status",
      "birth_date",
      "race",
      "religion",
      "address",
      "nationality",
      "contact_number",
      "email",
      "status",
    ]);
  }, [candidates, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(fromDate, toDate, jobPostingId, status);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setSearchQuery("");
    setJobPostingId("");
    setStatus("");
    setIsFilterApplied(false);

    onFilter(startDate, endDate);
  };

  // Paginate the filtered results
  const paginatedCandidates = useMemo(() => {
    return paginate(filteredCandidates, paginationInfo);
  }, [filteredCandidates, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
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

        <SelectFilter
          title="Job Title"
          options={jobPostsOptions}
          selected={jobPostingId}
          setSelected={setJobPostingId}
        />

        {page === "candidates" && (
          <SelectFilter
            title="Status"
            options={[
              { label: "Whitelisted", value: "whitelisted" },
              { label: "Blacklisted", value: "blacklisted" },
            ]}
            selected={status}
            setSelected={setStatus}
          />
        )}

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      {viewMode === "card" ? (
        <CandidatesCardView filteredCandidates={paginatedCandidates} />
      ) : (
        <CandidatesTableView filteredCandidates={paginatedCandidates} />
      )}

      {/* Pagination Controls */}
      {paginatedCandidates.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredCandidates.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredCandidates.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default CandidatesFilters;
