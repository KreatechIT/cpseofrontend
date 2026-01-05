import { MonthField } from "@/components/form-fields/MonthField";

import { useState } from "react";
import BudgetReportTable from "./BudgetReportTable";
import { format } from "date-fns";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";

const currentDate = format(new Date(), "yyyy-MM");

const BudgetReportFilters = ({ budgetReport, onFilter }) => {
  // Filter input state
  const [date, setDate] = useState(currentDate);
  // const [searchQuery, setSearchQuery] = useState("");
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(`${date}-01`);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setDate(currentDate);
    setIsFilterApplied(false);

    onFilter(`${currentDate}-01`);
  };

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls*/}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <MonthField date={date} setDate={setDate} view="filter" />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <BudgetReportTable data={budgetReport} />
    </section>
  );
};

export default BudgetReportFilters;
