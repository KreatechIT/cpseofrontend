import SelectFilter from "@/components/filters/SelectFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { useMemo, useState } from "react";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import AppPagination from "@/components/shared/AppPagination";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";
import { FINANCE_TRANSACTION_TYPE_CHOICES } from "../../../lib/financeEnums";
import BankSettingsTable from "./BankSettingsTable";

const BankSettingsFilters = ({ transactionDescriptions, onFilter }) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 20,
  });

  let filteredTransactionDescriptions = useMemo(() => {
    return filterBySearch(transactionDescriptions, searchQuery, [
      "name",
      "purpose",
    ]);
  }, [transactionDescriptions, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(selectedPurpose);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedPurpose("");
    setIsFilterApplied(false);

    onFilter();
  };

  // Paginate the filtered results
  const paginatedTransactionDescriptions = useMemo(() => {
    return paginate(filteredTransactionDescriptions, paginationInfo);
  }, [filteredTransactionDescriptions, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search by name, purpose etc..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <SelectFilter
          title="Purpose"
          options={FINANCE_TRANSACTION_TYPE_CHOICES}
          selected={selectedPurpose}
          setSelected={setSelectedPurpose}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <BankSettingsTable
        filteredTransactionDescriptions={paginatedTransactionDescriptions}
      />

      {/* Pagination Controls */}
      {paginatedTransactionDescriptions.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredTransactionDescriptions.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedTransactionDescriptions.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default BankSettingsFilters;
