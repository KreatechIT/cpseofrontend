import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import AppPagination from "@/components/shared/AppPagination";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import SelectFilter from "@/components/filters/SelectFilter";
import ExpenseSubSubCategoryTableView from "./ExpenseSubSubCategoryTableView";

const ExpenseSubSubCategoryFilters = ({
  expenseSubCategories,
  expenseSubSubCategories,
}) => {
  // Filter input states (controlled by inputs but not applied yet)
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [selectedSubCategoryInput, setSelectedSubCategoryInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Convert categories into dropdown options
  const subCategoriesOptions = useMemo(
    () => arrayToSelectOptions(expenseSubCategories, "name", "id"),
    [expenseSubCategories]
  );

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSearchQuery(searchQueryInput);
    setSelectedSubCategory(selectedSubCategoryInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchQueryInput("");
    setSelectedSubCategory("");
    setSelectedSubCategoryInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter companies by search query (name or address)
  let filteredExpenseSubSubCategories = useMemo(() => {
    return filterBySearch(expenseSubSubCategories, searchQuery, ["name"]);
  }, [expenseSubSubCategories, searchQuery]);

  // Further filter sub categories by selected category
  filteredExpenseSubSubCategories = useMemo(() => {
    if (!selectedSubCategory) return filteredExpenseSubSubCategories;

    return filteredExpenseSubSubCategories.filter(
      (subSubCategory) =>
        subSubCategory.expenses_sub_category_id === selectedSubCategory
    );
  }, [selectedSubCategory, filteredExpenseSubSubCategories]);

  // Paginate the filtered results
  const paginatedExpenseSubSubCategories = useMemo(() => {
    return paginate(filteredExpenseSubSubCategories, paginationInfo);
  }, [filteredExpenseSubSubCategories, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery || selectedSubCategory;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search expense sub sub categories by name..."
          searchQuery={searchQueryInput}
          setSearchQuery={setSearchQueryInput}
        />

        <SelectFilter
          title="Sub Category"
          options={subCategoriesOptions}
          selected={selectedSubCategoryInput}
          setSelected={setSelectedSubCategoryInput}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isAnyFilterApplied && (
          <ClearFilterButton onClick={handleClearFilters} />
        )}
      </div>

      {/* Organisation Display in Table or Card format */}
      <ExpenseSubSubCategoryTableView
        filteredExpenseSubSubCategories={paginatedExpenseSubSubCategories}
      />

      {/* Pagination Controls */}
      {paginatedExpenseSubSubCategories.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredExpenseSubSubCategories.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredExpenseSubSubCategories.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default ExpenseSubSubCategoryFilters;
