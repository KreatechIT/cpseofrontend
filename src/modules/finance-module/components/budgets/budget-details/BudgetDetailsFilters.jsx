import AppPagination from "@/components/shared/AppPagination";
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
import BudgetDetailsTable from "./BudgetDetailsTable";
import MonthRangeFilter from "@/components/filters/MonthRangeFilter";

const today = new Date();
const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // 1st day of current month
const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month

const formatMonth = (date) => date.toISOString().slice(0, 7); // "YYYY-MM"

const BudgetDetailsFilters = ({
  budgets,
  companies,
  departments,
  onFilter,
}) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromMonth, setFromMonth] = useState(formatMonth(startDate));
  const [toMonth, setToMonth] = useState(formatMonth(endDate));
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
  let filteredBudgets = useMemo(() => {
    return filterBySearch(budgets, searchQuery, [
      "submitted_date",
      "forecast_month",
      "company",
      "department",
      "sub_department",
      "description",
      "quantity",
      "forecast_cost",
      "goal",
      "execution_period_start",
      "execution_period_end",
      "status",
      "submitted_by",
    ]);
  }, [budgets, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(
      new Date(fromMonth + "-01"),
      new Date(toMonth + "-01"),
      selectedCompany,
      selectedDepartment,
      selectedStatus
    );
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromMonth(formatMonth(startDate));
    setToMonth(formatMonth(endDate));
    setSelectedCompany("");
    setSelectedDepartment("");
    setSearchQuery("");
    setSelectedStatus("");
    setIsFilterApplied(false);

    onFilter();
  };

  // Paginate the filtered results
  const paginatedBudgets = useMemo(() => {
    return paginate(filteredBudgets, paginationInfo);
  }, [filteredBudgets, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchFilterInput
          placeholder="Search by amount, description etc..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <MonthRangeFilter
          title="Month"
          fromMonth={fromMonth}
          setFromMonth={setFromMonth}
          toMonth={toMonth}
          setToMonth={setToMonth}
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

        <SelectFilter
          title="Status"
          options={[
            { label: "Submitted", value: 1 },
            { label: "Processing", value: 2 },
            { label: "Approved", value: 3 },
          ]}
          selected={selectedStatus}
          setSelected={setSelectedStatus}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <BudgetDetailsTable filteredBudgets={paginatedBudgets} />

      {/* Pagination Controls */}
      {paginatedBudgets.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredBudgets.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedBudgets.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default BudgetDetailsFilters;
