import useBanks from "@/modules/finance-module/hooks/useBanks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBankTransactions,
  getAllBankTypes,
  getAllCurrencyTypes,
} from "../../services/bankService";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";
import BankDetailsFilters from "../../components/banks/bank-details/BankDetailsFilters";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";

const BankDetailsPage = () => {
  const dispatch = useDispatch();
  const { bankTypes, currencyTypes, bankTransactions } = useSelector(
    (state) => state.banks
  );
  const { user } = useSelector((state) => state.auth);
  const { getMyBanks } = useBanks();
  const { hasPermission } = usePermission();
  const banks = getMyBanks();

  // Fetch Companies, Departments and Sub Departments
  useEffect(() => {
    !bankTypes && getAllBankTypes(dispatch);
    !currencyTypes && getAllCurrencyTypes(dispatch);
    !bankTransactions &&
      getAllBankTransactions(user?.organisation_id, dispatch);
  }, []);

  return (
    <>
      <title>Bank Details - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading pageTitle="Bank Details" withCardTableView={true} />

          <div>
            {hasPermission("finance_bank.add") && (
              <Button
                className="rounded-lg"
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addNewBank",
                      styles: "md:min-w-[750px] xl:min-w-[850px]",
                    })
                  );
                }}
              >
                Add New Bank
              </Button>
            )}
          </div>
        </div>

        {banks && bankTypes && currencyTypes ? (
          <BankDetailsFilters
            banks={banks}
            bankTypes={bankTypes}
            currencyTypes={currencyTypes}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default BankDetailsPage;
