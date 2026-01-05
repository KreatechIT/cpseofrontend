import usePermission from "@/hooks/usePermission";
import { useDispatch, useSelector } from "react-redux";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { CardSkeletons } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { getAllReferrals } from "@/modules/hr-module/services/referralService";
import ReferralsFilters from "@/modules/hr-module/components/referrals/ReferralsFilters";

const ReferralsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { referrals } = useSelector((state) => state.jobPostings);

  useEffect(() => {
    if (!referrals) getAllReferrals(user?.organisation_id, dispatch);
  }, []);

  const getReferralsFilteredData = (fromDate, toDate) => {
    getAllReferrals(user.organisation_id, dispatch, fromDate, toDate);
  };

  return (
    <>
      <title>Referrals - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Referrals" withCardTableView={false} />
          <div className="">
            {hasPermission("hr_referral.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addNewReferral",
                      styles: "md:min-w-[750px] xl:min-w-[850px]",
                    })
                  );
                }}
              >
                New Referral <Plus />
              </Button>
            )}
          </div>
        </div>

        {referrals ? (
          <ReferralsFilters
            referrals={referrals}
            onFilter={getReferralsFilteredData}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default ReferralsPage;
