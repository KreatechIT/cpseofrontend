import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWalletActivity } from "../../services/transactionService";
import { getAllCompanies } from "@/modules/member-module/services/companyService";
import WalletActivityFilters from "../../components/transactions/wallet-activities/WalletActivityFilters";
import { PageHeading } from "@/components/shared/PageHeading";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";

const WalletActivityPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { walletActivities } = useSelector((state) => state.transaction);
  const { companies } = useSelector((state) => state.company);

  // Fetch Wallet Activities Data.
  useEffect(() => {
    if (!walletActivities) getAllWalletActivity(user.organisation_id, dispatch);

    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
  }, []);

  const getWalletActivityFilteredData = (fromDate, toDate, company) => {
    getAllWalletActivity(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      company
    );
  };

  return (
    <>
      <title>Wallet Activities - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading
            pageTitle="Wallet Activities"
            withCardTableView={false}
          />

          <div className="flex gap-2.5 items-center">
            {hasPermission("finance_revenue.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addWalletActivity",
                      styles: "md:min-w-[750px] lg:min-w-[850px]",
                    })
                  );
                }}
              >
                Add New Activity
              </Button>
            )}
          </div>
        </div>

        {walletActivities && companies ? (
          <WalletActivityFilters
            walletActivities={walletActivities}
            companies={companies}
            onFilter={getWalletActivityFilteredData}
          />
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default WalletActivityPage;
