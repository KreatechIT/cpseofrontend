import AppPagination from "@/components/shared/AppPagination";
import SelectFilter from "@/components/filters/SelectFilter";
import { SearchFilterInput } from "@/components/filters/SearchFilter";
import { FINANCE_BANK_TYPE_CHOICES } from "../../../lib/financeEnums";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { filterBySearch } from "@/utils/filterBySearch";
import { paginate } from "@/utils/paginate";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import BankDetailsCardView from "./BankDetailsCardView";
import BankDetailsTableView from "./BankDetailsTableView";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";

const BankDetailsFilters = ({ banks, bankTypes, currencyTypes }) => {
  const viewMode = useSelector((state) => state.ui.viewMode);

  // -----------------------------
  // State Management
  // -----------------------------
  const [searchQuery, setSearchQuery] = useState("");

  // Filter input states (controlled by inputs but not applied yet)
  const [selectedBankInput, setSelectedBankInput] = useState("");
  const [selectedBankTypeInput, setSelectedBankTypeInput] = useState("");
  const [selectedCurrencyInput, setSelectedCurrencyInput] = useState("");
  const [selectedStatusInput, setSelectedStatusInput] = useState("");

  // Applied filter state (used for filtering when filter button is clicked)
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankType, setSelectedBankType] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 8,
  });

  // -----------------------------
  // Dropdown Options
  // -----------------------------
  const banksOptions = useMemo(
    () => arrayToSelectOptions(bankTypes, "string", "string"),
    [bankTypes]
  );

  const bankTypesOptions = useMemo(
    () => arrayToSelectOptions(FINANCE_BANK_TYPE_CHOICES, "label", "label"),
    []
  );

  const currencyOptions = useMemo(
    () => arrayToSelectOptions(currencyTypes, "string", "string"),
    [currencyTypes]
  );

  // -----------------------------
  // Filtering Logic (chained in order)
  // -----------------------------

  let filteredBanks = useMemo(() => {
    return filterBySearch(banks, searchQuery, [
      "bank",
      "bank_code",
      "bank_holder",
      "bank_number",
      "bank_currency",
      "total_balance",
      "daily_limit",
    ]);
  }, [banks, searchQuery]);

  filteredBanks = useMemo(() => {
    let result = filteredBanks;

    if (selectedBank) {
      result = result.filter((bank) => selectedBank === bank.bank);
    }

    if (selectedBankType) {
      result = result.filter((bank) => selectedBankType === bank.bank_type);
    }

    if (selectedStatus) {
      result = result.filter((bank) => selectedStatus === bank.status);
    }

    if (selectedCurrency) {
      result = result.filter((bank) => selectedCurrency === bank.bank_currency);
    }

    return result;
  }, [
    filteredBanks,
    selectedBank,
    selectedBankType,
    selectedCurrency,
    selectedStatus,
  ]);

  // Apply filters only when filter button is clicked
  const handleApplyFilters = () => {
    setSelectedBank(selectedBankInput);
    setSelectedBankType(selectedBankTypeInput);
    setSelectedCurrency(selectedCurrencyInput);
    setSelectedStatus(selectedStatusInput);
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters and reset states
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBank("");
    setSelectedBankInput("");
    setSelectedBankType("");
    setSelectedBankTypeInput("");
    setSelectedCurrency("");
    setSelectedCurrencyInput("");
    setSelectedStatus("");
    setSelectedStatusInput("");
    setPaginationInfo((prev) => ({ ...prev, currentPage: 1 }));
  };

  // -----------------------------
  // Paginate filtered results
  // -----------------------------
  const paginatedBanks = useMemo(() => {
    return paginate(filteredBanks, paginationInfo);
  }, [filteredBanks, paginationInfo]);

  // Determine if any filter is applied
  const isAnyFilterApplied =
    selectedBank || selectedBankType || selectedCurrency || selectedStatus;

  return (
    <section className="@container mt-5 h-full">
      {/* -----------------------------
          Filter Controls 
        ----------------------------- */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchFilterInput
          placeholder="Search banks by name, code, number, bank holder..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <SelectFilter
          title="Banks"
          options={banksOptions}
          selected={selectedBankInput}
          setSelected={setSelectedBankInput}
        />

        <SelectFilter
          title="Bank Types"
          options={bankTypesOptions}
          selected={selectedBankTypeInput}
          setSelected={setSelectedBankTypeInput}
        />

        <SelectFilter
          title="Currency"
          options={currencyOptions}
          selected={selectedCurrencyInput}
          setSelected={setSelectedCurrencyInput}
        />

        <SelectFilter
          title="Status"
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
          selected={selectedStatusInput}
          setSelected={setSelectedStatusInput}
        />

        {/* Apply Filters Button */}
        <FilterButton onClick={handleApplyFilters} />

        {/* Clear Filters Button (visible only if any filter is applied) */}
        {isAnyFilterApplied && (
          <ClearFilterButton onClick={handleClearFilters} />
        )}
      </div>

      {/* Display the filtered banks in either Card or Table view */}
      {viewMode === "card" ? (
        <BankDetailsCardView filteredBanks={filteredBanks} />
      ) : (
        <BankDetailsTableView filteredBanks={filteredBanks} />
      )}

      {/* -----------------------------
          Pagination Controls 
        ----------------------------- */}
      {paginatedBanks.length !== 0 && (
        <AppPagination
          currentPage={paginationInfo.currentPage}
          totalPages={Math.ceil(
            filteredBanks.length / paginationInfo.itemsPerPage
          )}
          itemsPerPage={paginationInfo.itemsPerPage}
          totalItems={filteredBanks.length}
          setPaginationInfo={setPaginationInfo}
          paginationOptionsType="card"
        />
      )}
    </section>
  );
};

export default BankDetailsFilters;
