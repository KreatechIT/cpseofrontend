import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDiscQuestions } from "../../services/personalityTestService";

import { CardSkeletons } from "@/components/ui/skeleton";
import DiscSettingsFilters from "../../components/personality-tests/disc-test/DiscSettingsFilters";

const DISCSettingsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { discQuestions } = useSelector((state) => state.personalityTest);

  useEffect(() => {
    if (!discQuestions) getAllDiscQuestions(user?.organisation_id, dispatch);
  }, []);

  const getDiscFilteredQuestions = (isActive) => {
    getAllDiscQuestions(user.organisation_id, dispatch, isActive);
  };

  return (
    <>
      <title>DISC Settings - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="DISC Settings" withCardTableView={false} />
          <div className="">
            {hasPermission("hr_referral.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addNewDiscQuestion",
                      styles: "md:min-w-[750px] xl:min-w-[850px]",
                    })
                  );
                }}
              >
                Add New Question <Plus />
              </Button>
            )}
          </div>
        </div>

        {discQuestions ? (
          <DiscSettingsFilters
            discQuestions={discQuestions}
            onFilter={getDiscFilteredQuestions}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default DISCSettingsPage;
