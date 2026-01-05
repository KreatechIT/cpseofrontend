import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AdminsCardView from "./AdminCardView";
import AdminsTableView from "./AdminTableView";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import FacetedFilter from "@/components/filters/SelectFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import AppPagination from "@/components/shared/AppPagination";

const AdminFilters = ({ admins, adminRoles }) => {
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
  const adminRolesOptions = useMemo(
    () => arrayToSelectOptions(adminRoles, "name", "name"),
    [adminRoles]
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

  // Filter admins by search query (name or address)
  let filteredAdmins = useMemo(() => {
    return filterBySearch(admins, searchQuery, [
      "first_name",
      "last_name",
      "address",
      "department",
    ]);
  }, [admins, searchQuery]);

  // Further filter admins by selected product
  filteredAdmins = useMemo(() => {
    if (!selectedRole) return filteredAdmins;

    return filteredAdmins.filter((admin) => selectedRole === admin.role);
  }, [selectedRole, filteredAdmins]);

  // Paginate the filtered results
  const paginatedAdmins = useMemo(() => {
    return paginate(filteredAdmins, paginationInfo);
  }, [filteredAdmins, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery || selectedRole;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search admins by name, address, department..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <FacetedFilter
          title="Role"
          options={adminRolesOptions}
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

      {/* Admins Display in Table or Card format */}
      {viewMode === "card" ? (
        <AdminsCardView filteredAdmins={paginatedAdmins} />
      ) : (
        <AdminsTableView filteredAdmins={paginatedAdmins} />
      )}

      {/* Pagination Controls */}
      {paginatedAdmins.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredAdmins.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredAdmins.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default AdminFilters;
