import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import AppPagination from "@/components/shared/AppPagination";
import ExpenseSubCategoryTableView from "./ExpenseSubCategoryTableView";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import SelectFilter from "@/components/filters/SelectFilter";

const ExpenseSubCategoryFilters = ({
  expenseCategories,
  expenseSubCategories,
  expenseSubSubCategories,
}) => {
  // Filter input states (controlled by inputs but not applied yet)
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [selectedCategoryInput, setSelectedCategoryInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Convert categories into dropdown options
  const categoriesOptions = useMemo(
    () => arrayToSelectOptions(expenseCategories, "name", "id"),
    [expenseCategories]
  );

  const expenseSubSubCategoryCounts = useMemo(() => {
    const counts = {};

    for (const subSubCategory of expenseSubSubCategories) {
      if (counts[subSubCategory.expenses_sub_category_id]) {
        counts[subSubCategory.expenses_sub_category_id] += 1;
      } else {
        counts[subSubCategory.expenses_sub_category_id] = 1;
      }
    }
    return counts;
  }, [expenseSubSubCategories]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSearchQuery(searchQueryInput);
    setSelectedCategory(selectedCategoryInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchQueryInput("");
    setSelectedCategory("");
    setSelectedCategoryInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter companies by search query (name or address)
  let filteredExpenseSubCategories = useMemo(() => {
    return filterBySearch(expenseSubCategories, searchQuery, ["name"]);
  }, [expenseSubCategories, searchQuery]);

  // Further filter sub categories by selected category
  filteredExpenseSubCategories = useMemo(() => {
    if (!selectedCategory) return filteredExpenseSubCategories;

    return filteredExpenseSubCategories.filter(
      (subCategory) => subCategory.expenses_category_id === selectedCategory
    );
  }, [selectedCategory, filteredExpenseSubCategories]);

  // Paginate the filtered results
  const paginatedExpenseSubCategories = useMemo(() => {
    return paginate(filteredExpenseSubCategories, paginationInfo);
  }, [filteredExpenseSubCategories, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery || selectedCategory;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search expense sub categories by name..."
          searchQuery={searchQueryInput}
          setSearchQuery={setSearchQueryInput}
        />

        <SelectFilter
          title="Category"
          options={categoriesOptions}
          selected={selectedCategoryInput}
          setSelected={setSelectedCategoryInput}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isAnyFilterApplied && (
          <ClearFilterButton onClick={handleClearFilters} />
        )}
      </div>

      {/* Organisation Display in Table or Card format */}
      <ExpenseSubCategoryTableView
        filteredExpenseSubCategories={paginatedExpenseSubCategories}
        expenseSubSubCategoryCounts={expenseSubSubCategoryCounts}
      />

      {/* Pagination Controls */}
      {paginatedExpenseSubCategories.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredExpenseSubCategories.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredExpenseSubCategories.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default ExpenseSubCategoryFilters;
