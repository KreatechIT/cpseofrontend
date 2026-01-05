import SelectFilter from "@/components/filters/SelectFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { useMemo, useState } from "react";
import ProfitLossStatementTable from "./ProfitLossStatementTable";
import DateRangeFilterWithPreset from "@/components/filters/DateRangeFilter";

const currentDate = new Date();
const startOfYear = new Date(new Date().getFullYear(), 0, 1);

const ProfitLossStatementFilters = ({
  plStatementData,
  companies,
  departments,
  onFilter,
}) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [fromDate, setFromDate] = useState(startOfYear);
  const [toDate, setToDate] = useState(currentDate);

  // Convert companies into dropdown options
  const companiesOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  // Convert departments into dropdown options
  const departmentsOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(fromDate, toDate, selectedCompany, selectedDepartment);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startOfYear);
    setToDate(currentDate);
    setSelectedCompany("");
    setSelectedDepartment("");
    setIsFilterApplied(false);

    onFilter(startOfYear, currentDate, selectedCompany, selectedDepartment);
  };

  return (
    <section className="@container mt-5 h-full  flex-grow flex flex-col ">
      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-2">
        <DateRangeFilterWithPreset
          title="Date"
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
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

      <ProfitLossStatementTable data={plStatementData} />
    </section>
  );
};

export default ProfitLossStatementFilters;
