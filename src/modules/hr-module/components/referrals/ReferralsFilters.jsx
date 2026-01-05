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
import ReferralsTableView from "./ReferralsTableView";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const ReferralsFilters = ({ referrals, onFilter }) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Filter companies by search query (name or address)
  let filteredReferrals = useMemo(() => {
    return filterBySearch(referrals, searchQuery, [
      "created",
      "refferals_id",
      "referrer_name",
      "job_reffered",
      "referee_name",
      "refferals_bonus",
    ]);
  }, [referrals, searchQuery]);

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
  const paginatedReferrals = useMemo(() => {
    return paginate(filteredReferrals, paginationInfo);
  }, [filteredReferrals, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchFilterInput
          placeholder="Search by name, job referred, bonus etc..."
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
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <ReferralsTableView filteredReferrals={paginatedReferrals} />

      {/* Pagination Controls */}
      {paginatedReferrals.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredReferrals.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedReferrals.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default ReferralsFilters;
