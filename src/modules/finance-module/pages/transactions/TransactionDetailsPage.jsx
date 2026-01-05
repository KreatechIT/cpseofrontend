import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactions } from "../../services/transactionService";
import { getAllCompanies } from "@/modules/member-module/services/companyService";
import { PageHeading } from "@/components/shared/PageHeading";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Button } from "@/components/ui/button";
import { getAllDepartments } from "@/modules/member-module/services/departmentService";
import { getAllCategories } from "../../services/expensesCategoryService";
import { getAllBanks } from "../../services/bankService";
import TransactionDetailsFilters from "../../components/transactions/transaction-details/TransactionDetailsFilters";
import { getAllMembers } from "@/modules/member-module/services/organisationService";
import { TableSkeleton } from "@/components/ui/skeleton";

const TransactionDetailsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { transactions } = useSelector((state) => state.transaction);
  const { companies } = useSelector((state) => state.company);
  const { departments } = useSelector((state) => state.department);
  const { banks } = useSelector((state) => state.banks);
  const { expenseCategories } = useSelector((state) => state.expenseCategory);
  const { members } = useSelector((state) => state.organisation);

  // Fetch Wallet Activities Data.
  useEffect(() => {
    if (!transactions) getAllTransactions(user.organisation_id, dispatch);

    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
    if (!expenseCategories) getAllCategories(user.organisation_id, dispatch);
    if (!banks) getAllBanks(user.organisation_id, dispatch);
    if (!members) getAllMembers(user.organisation_id, dispatch);
  }, []);

  const membersWithHodPermission = useMemo(
    () =>
      members?.filter(
        (member) => member.permissions.finance_transactionActions.hod_approve
      ),
    [members]
  );

  const getTransactionFilteredData = (
    fromDate,
    toDate,
    company,
    department,
    bankCode,
    type,
    category,
    status,
    approver
  ) => {
    getAllTransactions(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      company,
      department,
      bankCode,
      type,
      category,
      status,
      approver
    );
  };

  return (
    <>
      <title>Transaction Details - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading
            pageTitle="Transaction Details"
            withCardTableView={false}
          />

          <div className="flex gap-2.5 items-center">
            {hasPermission("finance_transaction.add") && (
              <>
                <Button
                  onClick={() => {
                    dispatch(
                      setDialogData({
                        type: "addCreditTransaction",
                        styles: "md:min-w-[750px] lg:min-w-[850px]",
                      })
                    );
                  }}
                >
                  Add Credit
                </Button>

                <Button
                  onClick={() => {
                    dispatch(
                      setDialogData({
                        type: "addDebitTransaction",
                        styles: "md:min-w-[750px] lg:min-w-[850px]",
                      })
                    );
                  }}
                >
                  Add Debit
                </Button>
              </>
            )}
          </div>
        </div>

        {transactions &&
        companies &&
        departments &&
        banks &&
        expenseCategories &&
        members ? (
          <TransactionDetailsFilters
            transactions={transactions}
            companies={companies}
            departments={departments}
            banks={banks}
            expenseCategories={expenseCategories}
            approvers={membersWithHodPermission}
            onFilter={getTransactionFilteredData}
          />
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default TransactionDetailsPage;
