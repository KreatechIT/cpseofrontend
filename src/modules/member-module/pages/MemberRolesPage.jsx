import usePermission from "@/hooks/usePermission";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMemberRoles,
  getAllMembers,
  getMemberRoleFormat,
} from "../services/organisationService";
import { useEffect } from "react";
import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberRoleFilters from "../components/member-roles/MemberRoleFilters";
import { CardSkeletons } from "@/components/ui/skeleton";

const MemberRolesPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  const { user } = useSelector((state) => state.auth);
  const { organisation, members, memberRoles, memberRoleFormat } = useSelector(
    (state) => state.organisation
  );

  // Fetch Organisations, members and roles
  useEffect(() => {
    if (!members) getAllMembers(user?.organisation_id, dispatch);
    if (!memberRoles) getAllMemberRoles(user?.organisation_id, dispatch);
    if (!memberRoleFormat) getMemberRoleFormat(dispatch);
  }, []);

  return (
    <>
      <title>Roles - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading withCardTableView={true}>
            <span className="font-thin">Roles of </span>
            <span>{organisation?.name}</span>
          </PageHeading>
          <div className="flex gap-2.5 items-center">
            {hasPermission("role.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addMemberRole",
                      props: { organisation },
                      styles: "md:min-w-[800px] xl:min-w-[900px]",
                    })
                  );
                }}
              >
                Add Role <Plus />
              </Button>
            )}
          </div>
        </div>

        {members && memberRoles ? (
          <MemberRoleFilters members={members} memberRoles={memberRoles} />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default MemberRolesPage;
