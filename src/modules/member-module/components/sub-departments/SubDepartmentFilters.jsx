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
import { useSelector } from "react-redux";
import SubDepartmentCardView from "./SubDepartmentCardView";
import SubDepartmentTableView from "./SubDepartmentTableView";
import AppPagination from "@/components/shared/AppPagination";

const SubDepartmentFilters = ({ departments, subDepartments }) => {
  // UI and Redux state
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Filter input states (controlled by inputs but not applied yet)
  const [selectedDepartmentInput, setSelectedDepartmentInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Convert departments into dropdown options
  const departmentsOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSelectedDepartment(selectedDepartmentInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
    setSelectedDepartmentInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter department by search query (name or address)
  let filteredSubDepartments = useMemo(() => {
    return filterBySearch(subDepartments, searchQuery, ["name", "strategy"]);
  }, [subDepartments, searchQuery]);

  // Further filter sub departments by selected department
  filteredSubDepartments = useMemo(() => {
    if (!selectedDepartment) return filteredSubDepartments;

    return filteredSubDepartments.filter(
      (subDept) => subDept.department_id === selectedDepartment
    );
  }, [selectedDepartment, filteredSubDepartments]);

  // Paginate the filtered results
  const paginatedSubDepartments = useMemo(() => {
    return paginate(filteredSubDepartments, paginationInfo);
  }, [filteredSubDepartments, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery || selectedDepartment;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search sub departments by name..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <SelectFilter
          title="Department"
          options={departmentsOptions}
          selected={selectedDepartmentInput}
          setSelected={setSelectedDepartmentInput}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isAnyFilterApplied && (
          <ClearFilterButton onClick={handleClearFilters} />
        )}
      </div>

      {/* Organisation Display in Table or Card format */}
      {viewMode === "card" ? (
        <SubDepartmentCardView
          filteredSubDepartments={paginatedSubDepartments}
        />
      ) : (
        <SubDepartmentTableView
          filteredSubDepartments={paginatedSubDepartments}
        />
      )}

      {/* Pagination Controls */}
      {paginatedSubDepartments.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredSubDepartments.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredSubDepartments.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default SubDepartmentFilters;
