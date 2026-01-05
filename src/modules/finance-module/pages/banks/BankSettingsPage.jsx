import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactionDescriptions } from "../../services/bankService";
import BankSettingsFilters from "../../components/banks/bank-settings/BankSettingsFilters";
import { TableSkeleton } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";

const BankSettingsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { transactionDescriptions } = useSelector((state) => state.banks);

  // Fetch Companies, Departments and Sub Departments
  useEffect(() => {
    !transactionDescriptions &&
      getAllTransactionDescriptions(user.organisation_id, dispatch);
  }, []);

  const getTransactionDescriptionsFilteredData = (purpose) => {
    getAllTransactionDescriptions(user.organisation_id, dispatch, purpose);
  };

  return (
    <>
      <title>Bank Settings - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading pageTitle="Bank Settings" withCardTableView={false} />

          <div>
            {hasPermission("finance_bank.add") && (
              <Button
                className="rounded-lg"
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addTransactionDescription",
                      styles: "md:min-w-[600px]",
                    })
                  );
                }}
              >
                Add New Description
              </Button>
            )}
          </div>
        </div>

        {transactionDescriptions ? (
          <BankSettingsFilters
            transactionDescriptions={transactionDescriptions}
            onFilter={getTransactionDescriptionsFilteredData}
          />
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default BankSettingsPage;
