import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";

import AppPagination from "@/components/shared/AppPagination";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import CompanyCardView from "./CompanyCardView";
import CompanyTableView from "./CompanyTableView";

const CompanyFilters = ({ companies, departments }) => {
  // UI and Redux state
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Count how many members are associated with each role.
  const departmentCounts = useMemo(() => {
    const counts = {};

    for (const department of departments) {
      for (const company of department.companies) {
        if (counts[company.id]) {
          counts[company.id] += 1;
        } else {
          counts[company.id] = 1;
        }
      }
    }
    return counts;
  }, [departments]);

  // Filter companies by search query (name or address)
  let filteredCompanies = useMemo(() => {
    return filterBySearch(companies, searchQuery, ["name"]);
  }, [companies, searchQuery]);

  // Paginate the filtered results
  const paginatedCompanies = useMemo(() => {
    return paginate(filteredCompanies, paginationInfo);
  }, [filteredCompanies, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search companies by name..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Organisation Display in Table or Card format */}
      {viewMode === "card" ? (
        <CompanyCardView
          filteredCompanies={paginatedCompanies}
          departmentCounts={departmentCounts}
        />
      ) : (
        <CompanyTableView
          filteredCompanies={paginatedCompanies}
          departmentCounts={departmentCounts}
        />
      )}

      {/* Pagination Controls */}
      {paginatedCompanies.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredCompanies.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredCompanies.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default CompanyFilters;
