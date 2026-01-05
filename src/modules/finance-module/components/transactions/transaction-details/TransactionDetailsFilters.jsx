import AppPagination from "@/components/shared/AppPagination";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
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
import TransactionDetailsTable from "./TransactionDetailsTable";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const TransactionDetailsFilters = ({
  transactions,
  companies,
  departments,
  banks,
  expenseCategories,
  approvers,
  onFilter,
}) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromDate, setFromDate] = useState(startDate);
  const [selectedApprover, setSelectedApprover] = useState("");
  const [toDate, setToDate] = useState(endDate);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Convert companies into dropdown options
  const companiesOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );
  const departmentsOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );
  const banksOptions = useMemo(
    () => arrayToSelectOptions(banks, "bank_code", "bank_code"),
    [banks]
  );
  const categoryOptions = useMemo(
    () => arrayToSelectOptions(expenseCategories, "name", "id"),
    [expenseCategories]
  );
  const approverOptions = useMemo(
    () =>
      approvers.map((approver) => {
        return {
          value: `${approver.first_name} ${approver.last_name}`,
          label: `${approver.first_name} ${approver.last_name}`,
        };
      }),
    [approvers]
  );

  // Filter companies by search query (name or address)
  let filteredTransactions = useMemo(() => {
    return filterBySearch(transactions, searchQuery, [
      "company",
      "department",
      "amount",
      "transaction_date",
      "category",
      "sub_department",
      "bank",
      "expenses_category",
      "expenses_sub_category",
      "expenses_sub_sub_category",
      "description",
    ]);
  }, [transactions, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(
      fromDate,
      toDate,
      selectedCompany,
      selectedDepartment,
      selectedBankCode,
      selectedType,
      selectedCategory,
      selectedStatus,
      selectedApprover
    );
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setSelectedCompany("");
    setSelectedDepartment("");
    setSelectedBankCode("");
    setSelectedCategory("");
    setSearchQuery("");
    setSelectedType("");
    setSelectedStatus("");
    setSelectedApprover("");
    setIsFilterApplied(false);

    onFilter(startDate, endDate);
  };

  // Paginate the filtered results
  const paginatedTransactions = useMemo(() => {
    return paginate(filteredTransactions, paginationInfo);
  }, [filteredTransactions, paginationInfo]);

  return (
    <section className="@container mt-5 h-full">
      {/* Filter Controls: Search + Faceted Filter + Action Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchFilterInput
          placeholder="Search by amount, description etc..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <DateRangeFilter
          title="Date"
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          preset={true}
        />

        <SelectFilter
          title="Company"
          options={companiesOptions}
          selected={selectedCompany}
          setSelected={setSelectedCompany}
        />

        <SelectFilter
          title="Department"
          options={departmentsOptions}
          selected={selectedDepartment}
          setSelected={setSelectedDepartment}
        />

        <SelectFilter
          title="Bank Code"
          options={banksOptions}
          selected={selectedBankCode}
          setSelected={setSelectedBankCode}
        />

        <SelectFilter
          title="Type"
          options={[
            { label: "Credit", value: 1 },
            { label: "Debit", value: 2 },
          ]}
          selected={selectedType}
          setSelected={setSelectedType}
        />

        <SelectFilter
          title="Category"
          options={categoryOptions}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />

        <SelectFilter
          title="Status"
          options={[
            { label: "Submitted", value: 1 },
            { label: "Processing", value: 2 },
            { label: "Approved", value: 3 },
            { label: "Rejected", value: 4 },
          ]}
          selected={selectedStatus}
          setSelected={setSelectedStatus}
        />

        <SelectFilter
          title="Approver"
          options={approverOptions}
          selected={selectedApprover}
          setSelected={setSelectedApprover}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <TransactionDetailsTable filteredTransactions={paginatedTransactions} />

      {/* Pagination Controls */}
      {paginatedTransactions.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredTransactions.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={paginatedTransactions.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default TransactionDetailsFilters;
