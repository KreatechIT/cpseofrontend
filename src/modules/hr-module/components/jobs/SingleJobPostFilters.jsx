import DateRangeFilter from "@/components/filters/DateRangeFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { useState } from "react";
import CandidatesTableView from "../candidates/CandidatesTableView";
import SingleJobPostDetails from "./SingleJobPostDetails";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const SingleJobPostFilters = ({ jobPost, jobCandidates, onFilter }) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);

  const maleCount = jobCandidates.filter((c) => c.gender === "Male").length;
  const femaleCount = jobCandidates.filter((c) => c.gender === "Female").length;

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(fromDate, toDate);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setIsFilterApplied(false);

    onFilter(startDate, endDate);
  };

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="flex justify-between items-start">
        <div className="mb-4 flex flex-grow flex-wrap items-center gap-2">
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
      </div>

      <SingleJobPostDetails
        jobPost={jobPost}
        maleCount={maleCount}
        femaleCount={femaleCount}
        totalCount={jobCandidates.length}
      />
      <CandidatesTableView filteredCandidates={jobCandidates} />
    </section>
  );
};

export default SingleJobPostFilters;
