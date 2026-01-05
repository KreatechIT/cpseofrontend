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
import VacancyTableView from "./VacancyTableView";
import { useSelector } from "react-redux";
import VacancysCardView from "./VacancyCardView";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const VacancyFilters = ({ vacancies, departments, onFilter }) => {
  const viewMode = useSelector((state) => state.ui.viewMode);
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  const departmentsOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );

  // Filter companies by search query (name or address)
  let filteredVacancies = useMemo(() => {
    return filterBySearch(vacancies, searchQuery, [
      "date",
      "department",
      "position",
      "reason_for_hiring",
      "number_of_vacancies",
      "reject_reason",
      "status",
    ]);
  }, [vacancies, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(fromDate, toDate, selectedDepartment);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setSelectedDepartment("");
    setSearchQuery("");
    setIsFilterApplied(false);

    onFilter(startDate, endDate);
  };

  // Paginate the filtered results
  const paginatedVacancies = useMemo(() => {
    return paginate(filteredVacancies, paginationInfo);
  }, [filteredVacancies, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchFilterInput
          placeholder="Search by position, department, vacancies etc..."
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

      {viewMode === "card" ? (
        <VacancysCardView filteredVacancies={paginatedVacancies} />
      ) : (
        <VacancyTableView filteredVacancies={paginatedVacancies} />
      )}

      {/* Pagination Controls */}
      {paginatedVacancies.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredVacancies.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedVacancies.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default VacancyFilters;
