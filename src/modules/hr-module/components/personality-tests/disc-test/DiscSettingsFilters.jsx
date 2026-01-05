import AppPagination from "@/components/shared/AppPagination";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import DiscTableView from "./DiscTableView";
import SelectFilter from "@/components/filters/SelectFilter";

const DiscSettingsFilters = ({ discQuestions, onFilter }) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Filter companies by search query (name or address)
  let filteredDiscQuestions = useMemo(() => {
    return filterBySearch(discQuestions, searchQuery, [
      "question",
      "answer_one",
      "answer_two",
      "answer_three",
      "answer_four",
    ]);
  }, [discQuestions, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(isActive);
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setIsActive("");
    setSearchQuery("");
    setIsFilterApplied(false);

    onFilter();
  };

  // Paginate the filtered results
  const paginatedDiscQuestions = useMemo(() => {
    return paginate(filteredDiscQuestions, paginationInfo);
  }, [filteredDiscQuestions, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchFilterInput
          placeholder="Search by questions, answers..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <SelectFilter
          title="Status"
          options={[
            { label: "Active", value: "True" },
            { label: "Inactive", value: "False" },
          ]}
          selected={isActive}
          setSelected={setIsActive}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <DiscTableView filteredDiscQuestions={paginatedDiscQuestions} />

      {/* Pagination Controls */}
      {paginatedDiscQuestions.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredDiscQuestions.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredDiscQuestions.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default DiscSettingsFilters;
