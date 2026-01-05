import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";

import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import AppPagination from "@/components/shared/AppPagination";
import FacetedFilter from "@/components/filters/SelectFilter";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import MemberCardViewByAdmin from "./MemberCardViewByAdmin";
import MemberTableViewByAdmin from "./MemberTableViewByAdmin";

const MemberFiltersByAdmin = ({ members, memberRoles, organisation }) => {
  // UI and Redux state
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Filter input states (controlled by inputs but not applied yet)
  const [selectedRoleInput, setSelectedRoleInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Convert organisation products into dropdown options
  const memberRolesOptions = useMemo(
    () => arrayToSelectOptions(memberRoles, "name", "name"),
    [memberRoles]
  );

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSelectedRole(selectedRoleInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRole("");
    setSelectedRoleInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter members by search query (name or address)
  let filteredMembers = useMemo(() => {
    return filterBySearch(members, searchQuery, [
      "first_name",
      "last_name",
      "address",
    ]);
  }, [members, searchQuery]);

  // Further filter members by selected product
  filteredMembers = useMemo(() => {
    if (!selectedRole) return filteredMembers;

    return filteredMembers.filter((member) => selectedRole === member.role);
  }, [selectedRole, filteredMembers]);

  // Paginate the filtered results
  const paginatedMembers = useMemo(() => {
    return paginate(filteredMembers, paginationInfo);
  }, [filteredMembers, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery || selectedRole;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search members by name, address..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <FacetedFilter
          title="Role"
          options={memberRolesOptions}
          selected={selectedRoleInput}
          setSelected={setSelectedRoleInput}
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
        <MemberCardViewByAdmin
          filteredMembers={paginatedMembers}
          organisation={organisation}
        />
      ) : (
        <MemberTableViewByAdmin
          filteredMembers={paginatedMembers}
          organisation={organisation}
        />
      )}

      {/* Pagination Controls */}
      {paginatedMembers.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredMembers.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredMembers.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default MemberFiltersByAdmin;
