import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";

import AppPagination from "@/components/shared/AppPagination";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import AdminRoleCardView from "./AdminRoleCardView";
import AdminRoleTableView from "./AdminRoleTableView";

const AdminRoleFilters = ({ admins, adminRoles }) => {
  // UI and Redux state
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Count how many admins are associated with each role.
  const adminCounts = useMemo(() => {
    const counts = {};
    for (const admin of admins) {
      counts[admin.role] = (counts[admin.role] || 0) + 1;
    }
    return counts;
  }, [admins]);

  // Filter admin roles by search query
  let filteredAdminRoles = useMemo(() => {
    return filterBySearch(adminRoles, searchQuery, ["name"]);
  }, [adminRoles, searchQuery]);

  // Paginate the filtered results
  const paginatedAdminRoles = useMemo(() => {
    return paginate(filteredAdminRoles, paginationInfo);
  }, [filteredAdminRoles, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search admin roles by name..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Admin roles display in Table or Card format */}
      {viewMode === "card" ? (
        <AdminRoleCardView
          filteredAdminRoles={paginatedAdminRoles}
          adminCounts={adminCounts}
        />
      ) : (
        <AdminRoleTableView
          filteredAdminRoles={paginatedAdminRoles}
          adminCounts={adminCounts}
        />
      )}

      {/* Pagination Controls */}
      {paginatedAdminRoles.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredAdminRoles.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredAdminRoles.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default AdminRoleFilters;
