import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMemberRoles,
  getAllMembers,
  getOrganisation,
} from "../services/organisationService";
import { getAllCompanies } from "../services/companyService";
import {
  getAllDepartments,
  getAllSubDepartments,
} from "../services/departmentService";
import { PageHeading } from "@/components/shared/PageHeading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  OrgNameAndMember,
  OrgProducts,
} from "@/modules/admin-module/components/organisations/OrganisationBlocks";
import { setDialogData } from "@/store/reducers/dialogSlice";
import RecentActivity from "../components/dashboard/RecentActivity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreeDotsIcon } from "@/components/icons/Icons";
import usePermission from "@/hooks/usePermission";
import { EditIcon } from "lucide-react";
import { CompanyMemberBarChart } from "../components/dashboard/CompanyBarChart";

const OrganisationDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { organisation, members, memberRoles } = useSelector(
    (state) => state.organisation
  );
  const { companies } = useSelector((state) => state.company);
  const { departments, subDepartments } = useSelector(
    (state) => state.department
  );
  const { hasPermission } = usePermission();

  useEffect(() => {
    !organisation && getOrganisation(user?.organisation_id, dispatch);
    !members && getAllMembers(user?.organisation_id, dispatch);
    !memberRoles && getAllMemberRoles(user?.organisation_id, dispatch);

    !companies && getAllCompanies(user.organisation_id, dispatch);
    !departments && getAllDepartments(user.organisation_id, dispatch);
    !subDepartments && getAllSubDepartments(user.organisation_id, dispatch);
  }, []);

  return (
    <main className="@container mt-1 flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PageHeading
          pageTitle="Organisation Dashboard"
          withCardTableView={false}
        />
      </div>

      <section className="mt-4 flex flex-col-reverse gap-4 @3xl:flex-row">
        <div className="@container w-full flex-grow">
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-2 gap-4 @2xl:grid-cols-4">
            <Card className="rounded-xl shadow-none">
              <CardContent className="flex flex-col items-start justify-center py-4">
                <p className="text-foreground text-5xl font-bold">
                  {members?.length || 0}
                </p>
                <span className="text-muted-foreground text-sm">Members</span>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-none">
              <CardContent className="flex flex-col items-start justify-center py-4">
                <p className="text-foreground text-5xl font-bold">
                  {memberRoles?.length || 0}
                </p>
                <span className="text-muted-foreground text-sm">Roles</span>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-none">
              <CardContent className="flex flex-col items-start justify-center py-4">
                <p className="text-foreground text-5xl font-bold">
                  {companies?.length || 0}
                </p>
                <span className="text-muted-foreground text-sm">Companies</span>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-none">
              <CardContent className="flex flex-col items-start justify-center py-4">
                <p className="text-foreground text-5xl font-bold">
                  {departments?.length || 0}
                </p>
                <span className="text-muted-foreground text-sm">
                  Departments
                </span>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            {companies && members && <CompanyMemberBarChart />}
          </div>
        </div>

        {/* Organisation Info and Recent Activities */}
        <div className="w-full shrink-0 space-y-4 @3xl:w-100 @5xl:w-110">
          {organisation && (
            <Card className="flex flex-col justify-between overflow-hidden rounded-xl shadow-none">
              <CardHeader className="relative flex items-center justify-between gap-4">
                <OrgNameAndMember organisation={organisation} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex cursor-pointer items-center justify-center px-2 pt-1">
                      <ThreeDotsIcon className="scale-75" />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent side="bottom" align="end">
                    {hasPermission("member.edit") && (
                      <DropdownMenuItem
                        onClick={() =>
                          dispatch(
                            setDialogData({
                              type: "organisationInternalEdit",
                              props: organisation,
                            })
                          )
                        }
                      >
                        <EditIcon size={16} aria-hidden="true" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="-mt-2 text-sm">
                <div>
                  <p className="text-muted-foreground mt-0">
                    <span className="text-foreground font-medium">
                      Address:
                    </span>{" "}
                    <span>{organisation?.address}</span>
                  </p>
                </div>

                {/* Products */}
                <div className="bg-primary/5 relative mt-4 h-24 rounded-lg border border-black/5 p-2 dark:border-white/10">
                  <p className="font-medium">Products</p>
                  <OrgProducts organisation={organisation} />
                </div>
              </CardContent>
            </Card>
          )}
          <RecentActivity />
        </div>
      </section>
    </main>
  );
};

export default OrganisationDashboard;
