import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeading } from "@/components/shared/PageHeading";

import {
  getAllBankTransactions,
  getAllTransactionDescriptions,
} from "../../services/bankService";
import { getAllMembers } from "@/modules/member-module/services/organisationService";
import { TableSkeleton } from "@/components/ui/skeleton";
import useBanks from "@/modules/finance-module/hooks/useBanks";
import BankTransactionFilters from "../../components/banks/bank-transactions/BankTransactionFilters";

const BankTransactionPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bankTransactions } = useSelector((state) => state.banks);
  const { members } = useSelector((state) => state.organisation);
  const { getMyBanks } = useBanks();
  const { transactionDescriptions } = useSelector((state) => state.banks);

  // Fetch Wallet Activities Data.
  useEffect(() => {
    if (!bankTransactions)
      getAllBankTransactions(user.organisation_id, dispatch);

    if (!members) getAllMembers(user.organisation_id, dispatch);

    !transactionDescriptions &&
      getAllTransactionDescriptions(user.organisation_id, dispatch);
  }, []);

  const membersWithHodPermission = useMemo(
    () =>
      members?.filter(
        (member) => member.permissions.finance_transactionActions.hod_approve
      ),
    [members]
  );

  const banks = getMyBanks();

  const getBankTransactionFilteredData = (
    fromDate,
    toDate,
    bankCode,
    type,
    status,
    description,
    approver
  ) => {
    getAllBankTransactions(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      bankCode,
      type,
      status,
      description,
      approver
    );
  };

  return (
    <>
      <title>Bank Transactions - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading
            pageTitle="Bank Transactions"
            withCardTableView={false}
          />
        </div>

        {bankTransactions && banks && members && transactionDescriptions ? (
          <BankTransactionFilters
            transactions={bankTransactions}
            banks={banks}
            approvers={membersWithHodPermission}
            transactionDescriptions={transactionDescriptions}
            onFilter={getBankTransactionFilteredData}
          />
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default BankTransactionPage;
