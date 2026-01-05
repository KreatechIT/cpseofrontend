import AppPagination from "@/components/shared/AppPagination";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import SelectFilter from "@/components/filters/SelectFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import ClaimDetailsTable from "./ClaimDetailsTable";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const ClaimsFilters = ({ claims, companies, departments, onFilter }) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Convert companies into dropdown options
  const companiesOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );
  const departmentsOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );

  // Filter companies by search query (name or address)
  let filteredClaims = useMemo(() => {
    return filterBySearch(claims, searchQuery, [
      "submitted_date",
      "claim_date",
      "claimed_by",
      "claim_amount",
      "department",
      "claim_date",
      "category",
      "from_bank_account",
      "expenses_category",
      "expenses_sub_category",
      "expenses_sub_sub_category",
      "type",
      "details",
      "status",
    ]);
  }, [claims, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(fromDate, toDate, selectedCompany, selectedDepartment);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setSelectedCompany("");
    setSelectedDepartment("");
    setSearchQuery("");
    setIsFilterApplied(false);

    onFilter(startDate, endDate);
  };

  // Paginate the filtered results
  const paginatedClaims = useMemo(() => {
    return paginate(filteredClaims, paginationInfo);
  }, [filteredClaims, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchFilterInput
          placeholder="Search by amount, description etc..."
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
          title="Company"
          options={companiesOptions}
          selected={selectedCompany}
          setSelected={setSelectedCompany}
        />

        <SelectFilter
          title="Department"
          options={departmentsOptions}
          selected={selectedDepartment}
          setSelected={setSelectedDepartment}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <ClaimDetailsTable filteredClaims={paginatedClaims} />

      {/* Pagination Controls */}
      {paginatedClaims.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredClaims.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedClaims.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default ClaimsFilters;
