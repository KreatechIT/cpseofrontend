import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";

import {
  getAllMemberRoles,
  getAllMembers,
} from "../services/organisationService";
import MemberFilters from "../components/members/MemberFilters";

const MemberPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { organisation, members, memberRoles } = useSelector(
    (state) => state.organisation
  );

  // Fetch members and roles
  useEffect(() => {
    if (!members) getAllMembers(user?.organisation_id, dispatch);
    if (!memberRoles) getAllMemberRoles(user?.organisation_id, dispatch);
  }, []);

  return (
    <>
      <title>Members - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading withCardTableView={true}>
            <span className="font-thin">Members of </span>
            <span>{organisation?.name}</span>
          </PageHeading>
          <div className="flex gap-2.5 items-center">
            {hasPermission("member.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addMember",
                      styles: "md:min-w-[750px] lg:min-w-[850px]",
                    })
                  );
                }}
              >
                Add Member <Plus />
              </Button>
            )}
          </div>
        </div>

        {members && memberRoles ? (
          <MemberFilters members={members} memberRoles={memberRoles} />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default MemberPage;
