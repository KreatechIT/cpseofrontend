import SelectFilter from "@/components/filters/SelectFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { useMemo, useState } from "react";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import AppPagination from "@/components/shared/AppPagination";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";
import WalletActivityTable from "./WalletActivityTable";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const WalletActivityFilters = ({ walletActivities, companies, onFilter }) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 20,
  });

  // Convert companies into dropdown options
  const companiesOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  // Filter companies by search query (name or address)
  let filteredWalletActivities = useMemo(() => {
    return filterBySearch(walletActivities, searchQuery, [
      "company",
      "deposit_amount",
      "withdraw_amount",
      "bonus_given_amount",
      "description",
    ]);
  }, [walletActivities, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(fromDate, toDate, selectedCompany);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setSelectedCompany("");
    setSearchQuery("");
    setIsFilterApplied(false);

    onFilter(startDate, endDate, selectedCompany);
  };

  // Paginate the filtered results
  const paginatedWalletActivities = useMemo(() => {
    return paginate(filteredWalletActivities, paginationInfo);
  }, [filteredWalletActivities, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex items-center gap-2">
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

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <WalletActivityTable
        filteredWalletActivities={paginatedWalletActivities}
      />

      {/* Pagination Controls */}
      {paginatedWalletActivities.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredWalletActivities.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedWalletActivities.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default WalletActivityFilters;
