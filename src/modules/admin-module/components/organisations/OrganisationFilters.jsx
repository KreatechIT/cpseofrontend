import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { paginate } from "@/utils/paginate";
import { filterBySearch } from "@/utils/filterBySearch";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";

import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import OrganisationCardView from "./OrganisationCardView";
import OrganisationTableView from "./OrganisationTableView";
import AppPagination from "@/components/shared/AppPagination";
import FacetedFilter from "@/components/filters/SelectFilter";
import { SearchFilterInput } from "@/components/filters/SearchFilter";

const OrganisationFilters = ({ organisations, organisationProducts }) => {
  // UI and Redux state
  const viewMode = useSelector((state) => state.ui.viewMode);

  // Filter input states (controlled by inputs but not applied yet)
  const [selectedProductInput, setSelectedProductInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // Convert organisation products into dropdown options
  const organisationProductsOptions = useMemo(
    () => arrayToSelectOptions(organisationProducts, "name", "name"),
    [organisationProducts]
  );

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSelectedProduct(selectedProductInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedProduct("");
    setSelectedProductInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Filter organisations by search query (name or address)
  let filteredOrganisations = useMemo(() => {
    return filterBySearch(organisations, searchQuery, ["name", "address"]);
  }, [organisations, searchQuery]);

  // Further filter organisations by selected product
  filteredOrganisations = useMemo(() => {
    if (!selectedProduct) return filteredOrganisations;

    return filteredOrganisations.filter((org) =>
      org.products.some((product) => selectedProduct === product.name)
    );
  }, [selectedProduct, filteredOrganisations]);

  // Paginate the filtered results
  const paginatedOrganisations = useMemo(() => {
    return paginate(filteredOrganisations, paginationInfo);
  }, [filteredOrganisations, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied = searchQuery || selectedProduct;

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls */}
      <div className="mb-4 flex items-center gap-2">
        <SearchFilterInput
          placeholder="Search organisations by name, address..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <FacetedFilter
          title="Product"
          options={organisationProductsOptions}
          selected={selectedProductInput}
          setSelected={setSelectedProductInput}
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
        <OrganisationCardView filteredOrganisations={paginatedOrganisations} />
      ) : (
        <OrganisationTableView filteredOrganisations={paginatedOrganisations} />
      )}

      {/* Pagination Controls */}
      {paginatedOrganisations.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredOrganisations.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredOrganisations.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default OrganisationFilters;
