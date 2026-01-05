import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import ExpenseCategoryTableView from "./ExpenseCategoryTableView";
import AppPagination from "@/components/shared/AppPagination";

const ExpenseCategoryFilters = ({
  expenseCategories,
  expenseSubCategories,
}) => {
  // Filter input states (controlled by inputs but not applied yet)
  const [searchQueryInput, setSearchQueryInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  const expenseSubCategoryCounts = useMemo(() => {
    const counts = {};

    for (const subCategory of expenseSubCategories) {
      if (counts[subCategory.expenses_category_id]) {
        counts[subCategory.expenses_category_id] += 1;
      } else {
        counts[subCategory.expenses_category_id] = 1;
      }
    }
    return counts;
  }, [expenseSubCategories]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSearchQuery(searchQueryInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchQueryInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter companies by search query (name or address)
  let filteredExpenseCategories = useMemo(() => {
    return filterBySearch(expenseCategories, searchQuery, ["name"]);
  }, [expenseCategories, searchQuery]);

  // Paginate the filtered results
  const paginatedExpenseCategories = useMemo(() => {
    return paginate(filteredExpenseCategories, paginationInfo);
  }, [filteredExpenseCategories, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search expense categories by name..."
          searchQuery={searchQueryInput}
          setSearchQuery={setSearchQueryInput}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isAnyFilterApplied && (
          <ClearFilterButton onClick={handleClearFilters} />
        )}
      </div>

      {/* Organisation Display in Table or Card format */}
      <ExpenseCategoryTableView
        filteredExpenseCategories={paginatedExpenseCategories}
        expenseSubCategoryCounts={expenseSubCategoryCounts}
      />

      {/* Pagination Controls */}
      {paginatedExpenseCategories.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredExpenseCategories.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedExpenseCategories.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default ExpenseCategoryFilters;
