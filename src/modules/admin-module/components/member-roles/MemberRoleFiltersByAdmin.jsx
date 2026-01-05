import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";

import AppPagination from "@/components/shared/AppPagination";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import MemberRoleCardViewByAdmin from "./MemberRoleCardViewByAdmin";
import MemberRoleTableViewByAdmin from "./MemberRoleTableViewByAdmin";

const MemberRoleFiltersByAdmin = ({ members, memberRoles, organisation }) => {
  // UI and Redux state
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Applied filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Count how many members are associated with each role.
  const memberCounts = useMemo(() => {
    const counts = {};
    for (const member of members) {
      counts[member.role] = (counts[member.role] || 0) + 1;
    }
    return counts;
  }, [members]);

  // Filter members by search query (name or address)
  let filteredMemberRoles = useMemo(() => {
    return filterBySearch(memberRoles, searchQuery, ["name"]);
  }, [memberRoles, searchQuery]);

  // Paginate the filtered results
  const paginatedMemberRoles = useMemo(() => {
    return paginate(filteredMemberRoles, paginationInfo);
  }, [filteredMemberRoles, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search member roles by name..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Organisation Display in Table or Card format */}
      {viewMode === "card" ? (
        <MemberRoleCardViewByAdmin
          filteredMemberRoles={paginatedMemberRoles}
          memberCounts={memberCounts}
          organisation={organisation}
        />
      ) : (
        <MemberRoleTableViewByAdmin
          filteredMemberRoles={paginatedMemberRoles}
          memberCounts={memberCounts}
          organisation={organisation}
        />
      )}

      {/* Pagination Controls */}
      {paginatedMemberRoles.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredMemberRoles.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredMemberRoles.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default MemberRoleFiltersByAdmin;
