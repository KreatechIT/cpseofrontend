import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";

import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import AppPagination from "@/components/shared/AppPagination";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import DepartmentCardView from "./DepartmentCardView";
import DepartmentTableView from "./DepartmentTableView";
import SelectFilter from "@/components/filters/SelectFilter";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";

const DepartmentFilters = ({ companies, departments, subDepartments }) => {
  // UI and Redux state
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Filter input states (controlled by inputs but not applied yet)
  const [selectedCompanyInput, setSelectedCompanyInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Convert companies into dropdown options
  const companiesOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  // Count how many members are associated with each role.
  const subDepartmentCounts = useMemo(() => {
    const counts = {};

    for (const subDepartment of subDepartments) {
      counts[subDepartment.department_id] =
        counts[subDepartment.department_id] + 1 || 1;
    }
    return counts;
  }, [subDepartments]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSelectedCompany(selectedCompanyInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCompany("");
    setSelectedCompanyInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter department by search query (name or address)
  let filteredDepartments = useMemo(() => {
    return filterBySearch(departments, searchQuery, ["name"]);
  }, [departments, searchQuery]);

  // Further filter members by selected product
  filteredDepartments = useMemo(() => {
    if (!selectedCompany) return filteredDepartments;

    return filteredDepartments.filter((dept) =>
      dept.companies.some((c) => c.id === selectedCompany)
    );
  }, [selectedCompany, filteredDepartments]);

  // Paginate the filtered results
  const paginatedDepartments = useMemo(() => {
    return paginate(filteredDepartments, paginationInfo);
  }, [filteredDepartments, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery || selectedCompany;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search departments by name..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <SelectFilter
          title="Company"
          options={companiesOptions}
          selected={selectedCompanyInput}
          setSelected={setSelectedCompanyInput}
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
        <DepartmentCardView
          filteredDepartments={paginatedDepartments}
          subDepartmentCounts={subDepartmentCounts}
        />
      ) : (
        <DepartmentTableView
          filteredDepartments={paginatedDepartments}
          subDepartmentCounts={subDepartmentCounts}
        />
      )}

      {/* Pagination Controls */}
      {paginatedDepartments.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredDepartments.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredDepartments.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default DepartmentFilters;
