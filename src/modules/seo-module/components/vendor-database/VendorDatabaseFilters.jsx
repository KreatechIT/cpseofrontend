import AppPagination from "@/components/shared/AppPagination";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import SelectFilter from "@/components/filters/SelectFilter";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import VendorDatabaseTableView from "./VendorDatabaseTableView";
import { useSelector } from "react-redux";
import VendorDatabaseCardView from "./VendorDatabaseCardView";

const VendorDatabaseFilters = ({
  vendors,
  departments, // not used in current API, but kept if needed later
  vendorTypes, // not used, but kept for future
  onFilter,
}) => {
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Filter states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState(""); // public / hidden
  const [selectedHiddenReason, setSelectedHiddenReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Visibility options
  const visibilityOptions = [
    { value: "", label: "All Visibility" },
    { value: "public", label: "Public" },
    { value: "hidden", label: "Hidden" },
  ];

  // Hidden reason options (only show if visibility=hidden)
  const hiddenReasonOptions = [
    { value: "", label: "Any Reason" },
    { value: "high_risk", label: "High Risk" },
    { value: "blacklisted", label: "Blacklisted" },
    { value: "low_quality_backlink", label: "Low Quality Backlink" },
    { value: "low_productivity", label: "Low Productivity" },
  ];

  // Live search - matches your real fields
  const searchFiltered = useMemo(() => {
    if (!vendors || !searchQuery) return vendors || [];

    const term = searchQuery.toLowerCase();
    return vendors.filter((vendor) =>
      [
        vendor.vendor_name,
        vendor.website_url,
        vendor.teams_id,
        vendor.whatsapp,
        vendor.payment_method,
        vendor.comment_remark,
      ].some((field) => field?.toLowerCase().includes(term))
    );
  }, [vendors, searchQuery]);

  // Apply filters on button click
  const handleApplyFilters = () => {
    // You can extend onFilter later if server-side filtering is added
    // For now, we just mark as applied so Clear button shows
    setIsFilterApplied(true);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedVisibility("");
    setSelectedHiddenReason("");
    setSearchQuery("");
    setIsFilterApplied(false);
    setPaginationInfo({ ...paginationInfo, currentPage: 1 });
  };

  // Final client-side filtering
  const filteredVendors = useMemo(() => {
    let result = searchFiltered;

    if (selectedVisibility) {
      result = result.filter((v) => v.visibility === selectedVisibility);
    }

    if (selectedHiddenReason) {
      result = result.filter((v) => v.hidden_reason === selectedHiddenReason);
    }

    return result;
  }, [searchFiltered, selectedVisibility, selectedHiddenReason]);

  // Paginated results
  const paginatedVendors = useMemo(() => {
    return paginate(filteredVendors, paginationInfo);
  }, [filteredVendors, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <SearchFilterInput
          placeholder="Search by name, website, teams ID, whatsapp..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <SelectFilter
          title="Visibility"
          options={visibilityOptions}
          selected={selectedVisibility}
          setSelected={setSelectedVisibility}
        />

        {selectedVisibility === "hidden" && (
          <SelectFilter
            title="Hidden Reason"
            options={hiddenReasonOptions}
            selected={selectedHiddenReason}
            setSelected={setSelectedHiddenReason}
          />
        )}

        <FilterButton onClick={handleApplyFilters} />

        {isFilterApplied && (
          <ClearFilterButton onClick={handleClearFilters} />
        )}
      </div>

      {/* View Mode: Card or Table */}
      {viewMode === "card" ? (
        <VendorDatabaseCardView filteredVendors={paginatedVendors} />
      ) : (
        <VendorDatabaseTableView filteredVendors={paginatedVendors} />
      )}

      {/* Pagination */}
      {paginatedVendors.length > 0 && (
        <div className="mt-8">
          <AppPagination
            currentPage={paginationInfo.currentPage}
            totalPages={Math.ceil(filteredVendors.length / paginationInfo.itemsPerPage)}
            itemsPerPage={paginationInfo.itemsPerPage}
            totalItems={filteredVendors.length}
            setPaginationInfo={setPaginationInfo}
          />
        </div>
      )}
    </section>
  );
};

export default VendorDatabaseFilters;