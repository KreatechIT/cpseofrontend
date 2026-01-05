import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMemberRoles,
  getAllMembers,
  getAllOrganisations,
} from "../services/organisationByAdminService";
import { Button } from "@/components/ui/button";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";
import { useTheme } from "@/components/themes/ThemeProvider";
import { Link, useParams } from "react-router-dom";
import MemberFiltersByAdmin from "../components/members/MemberFiltersByAdmin";

import OrganisationIllustrationLight from "@/assets/images/organisation-illustration-white.png";
import OrganisationIllustrationDark from "@/assets/images/organisation-illustration-dark.png";

const MembersPageByAdmin = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { organisation_id } = useParams();
  const { hasPermission } = usePermission();
  const { organisations, members, memberRoles } = useSelector(
    (state) => state.organisationsByAdmin
  );

  // Fetch Organisations, members and roles
  useEffect(() => {
    if (!organisations) getAllOrganisations(dispatch);

    if (!members[organisation_id]) getAllMembers(organisation_id, dispatch);
    if (!memberRoles[organisation_id])
      getAllMemberRoles(organisation_id, dispatch);
  }, []);

  const organisation = organisations
    ? organisations.find((org) => org.id === organisation_id)
    : null;

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
            {hasPermission("role.read") && (
              <Link to={`/user-access/organisation/${organisation_id}/roles`}>
                <Button variant="outline">View Roles</Button>
              </Link>
            )}

            {hasPermission("member.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addMemberByAdmin",
                      props: { organisation_id },
                      styles: "md:min-w-[750px]",
                    })
                  );
                }}
              >
                Add Member <Plus />
              </Button>
            )}
          </div>
        </div>

        {members[organisation_id] && members[organisation_id].length === 0 && (
          <div className="mt-10">
            <div className="mb-12 flex gap-4 text-2xl">
              No members yet{" "}
              <div>
                <Button
                  onClick={() => {
                    dispatch(
                      setDialogData({
                        type: "addMemberByAdmin",
                        props: { organisation_id },
                      })
                    );
                  }}
                >
                  Add Member <Plus />
                </Button>
              </div>
            </div>

            <img
              src={
                theme === "dark"
                  ? OrganisationIllustrationDark
                  : OrganisationIllustrationLight
              }
              className="mx-auto"
              alt="Organisation Illustration"
            />
          </div>
        )}

        {members[organisation_id] && memberRoles[organisation_id] ? (
          <MemberFiltersByAdmin
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

export default MembersPageByAdmin;
