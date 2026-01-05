import { NewCompanyIcon } from "@/components/icons/Icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMembers } from "../../services/organisationService";
import { Card, CardContent } from "@/components/ui/card";
import { MemberNameAndEmail } from "../members/MemberBlocks";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayersIcon } from "lucide-react";

const CompanyDetails = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const company = useSelector((state) => state.dialog.props);
  const { departments } = useSelector((state) => state.department);
  const { members } = useSelector((state) => state.organisation);

  useEffect(() => {
    !members && getAllMembers(user?.organisation_id, dispatch);
  }, []);

  if (!company) {
    return (
      <p className="text-muted-foreground text-center">
        No company data available.
      </p>
    );
  }

  const companyDepartments = departments?.filter((dept) =>
    dept?.companies.some((c) => c.id === company.id)
  );

  const companyMembers = members?.filter((member) =>
    member?.company_ids.includes(company.id)
  );

  return (
    <section>
      <div className="-mt-6 mb-8">
        <NewCompanyIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl mt-2 font-light">
          Details of <span className="font-medium">{company.name}</span>
        </h2>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-lg font-medium">Departments</h3>
        <Separator className="mb-2 -mt-2" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companyDepartments?.length > 0 ? (
            companyDepartments.map((dept) => (
              <Card
                className="dark:bg-card overflow-hidden rounded-xl bg-white py-2 shadow-none"
                key={dept.id}
              >
                <CardContent className="px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 rounded-full border border-black/10">
                      <AvatarFallback className="dark:bg-white/10">
                        <LayersIcon
                          size={20}
                          className="opacity-60"
                          aria-hidden="true"
                        />
                      </AvatarFallback>
                    </Avatar>
                    {dept?.name}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No departments.</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-lg font-medium">Members</h3>
        <Separator className="mb-2 -mt-2" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companyMembers?.length > 0 ? (
            companyMembers.map((member) => (
              <Card
                className="dark:bg-card overflow-hidden rounded-xl bg-white py-2 shadow-none"
                key={member.id}
              >
                <CardContent className="px-4 text-sm">
                  <MemberNameAndEmail member={member} view="table" />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No members.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CompanyDetails;
