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
import { FINANCE_TRANSACTION_TYPE_CHOICES } from "../../../lib/financeEnums";
import BankTransactionTable from "./BankTransactionTable";

const endDate = new Date(); // Current date
const startDate = new Date();
startDate.setDate(endDate.getDate() - 30); // 30 days before current date

const BankTransactionFilters = ({
  transactions,
  banks,
  approvers,
  transactionDescriptions,
  onFilter,
}) => {
  // Filter input states
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromDate, setFromDate] = useState(startDate);
  const [selectedApprover, setSelectedApprover] = useState("");
  const [toDate, setToDate] = useState(endDate);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  const banksOptions = useMemo(
    () => arrayToSelectOptions(banks, "bank_code", "bank_code"),
    [banks]
  );

  const uniqueByDescription = transactionDescriptions.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.description === item.description)
  );

  const descriptionOptions = useMemo(
    () =>
      arrayToSelectOptions(uniqueByDescription, "description", "description"),
    [uniqueByDescription]
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
      "transaction_date",
      "bank",
      "amount",
      "transaction_type",
      "description",
      "status",
      "exchange_rate",
      "initial_amount",
      "approver",
    ]);
  }, [transactions, searchQuery]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    onFilter(
      fromDate,
      toDate,
      selectedBankCode,
      selectedType,
      selectedStatus,
      selectedDescription,
      selectedApprover
    );
    setIsFilterApplied(true);
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setFromDate(startDate);
    setToDate(endDate);
    setSelectedBankCode("");
    setSearchQuery("");
    setSelectedType("");
    setSelectedStatus("");
    setSelectedDescription("");
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
          title="Bank Code"
          options={banksOptions}
          selected={selectedBankCode}
          setSelected={setSelectedBankCode}
        />

        <SelectFilter
          title="Type"
          options={FINANCE_TRANSACTION_TYPE_CHOICES}
          selected={selectedType}
          setSelected={setSelectedType}
        />

        <SelectFilter
          title="Status"
          options={[
            { label: "Submitted", value: 1 },
            { label: "Approved", value: 2 },
            { label: "Rejected", value: 3 },
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

        <SelectFilter
          title="Description"
          options={descriptionOptions}
          selected={selectedDescription}
          setSelected={setSelectedDescription}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isFilterApplied && <ClearFilterButton onClick={handleClearFilters} />}
      </div>

      <BankTransactionTable filteredTransactions={paginatedTransactions} />

      {/* Pagination Controls */}
      {paginatedTransactions.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredTransactions.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredTransactions.length}
          setPaginationInfo={setPaginationInfo}
        />
      )}
    </section>
  );
};

export default BankTransactionFilters;
