import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMemberRoles,
  getAllMembers,
  getAllOrganisations,
  getMemberRoleFormat,
} from "../services/organisationByAdminService";
import { Button } from "@/components/ui/button";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";
import { Link, useParams } from "react-router-dom";
import MemberRoleFiltersByAdmin from "../components/member-roles/MemberRoleFiltersByAdmin";

const MemberRolesPageByAdmin = () => {
  const dispatch = useDispatch();
  const { organisation_id } = useParams();
  const { hasPermission } = usePermission();
  const { organisations, members, memberRoles, memberRoleFormat } = useSelector(
    (state) => state.organisationsByAdmin
  );

  // Fetch Organisations, members and roles
  useEffect(() => {
    if (!organisations) getAllOrganisations(dispatch);

    if (!members[organisation_id]) getAllMembers(organisation_id, dispatch);
    if (!memberRoles[organisation_id])
      getAllMemberRoles(organisation_id, dispatch);
    if (!memberRoleFormat) getMemberRoleFormat(dispatch);
  }, []);

  const organisation = organisations
    ? organisations.find((org) => org.id === organisation_id)
    : null;

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
            {hasPermission("member.read") && (
              <Link to={`/user-access/organisation/${organisation_id}/members`}>
                <Button variant="outline">View Members</Button>
              </Link>
            )}

            {hasPermission("role.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addMemberRoleByAdmin",
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

        {members[organisation_id] && memberRoles[organisation_id] ? (
          <MemberRoleFiltersByAdmin
            members={members[organisation_id]}
            memberRoles={memberRoles[organisation_id]}
            organisation={organisation}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default MemberRolesPageByAdmin;
