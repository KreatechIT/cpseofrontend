import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMembers } from "../../services/organisationService";
import { NewDepartmentIcon } from "@/components/icons/Icons";
import { Card, CardContent } from "@/components/ui/card";
import { MemberNameAndEmail } from "../members/MemberBlocks";
import { Separator } from "@/components/ui/separator";

const SubDepartmentDetails = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const subDepartment = useSelector((state) => state.dialog.props);
  const { members } = useSelector((state) => state.organisation);

  useEffect(() => {
    !members && getAllMembers(user?.organisation_id, dispatch);
  }, []);

  if (!subDepartment) {
    return (
      <p className="text-muted-foreground text-center">
        No sub department data available.
      </p>
    );
  }

  const subDeptMembers = members?.filter((member) =>
    member?.sub_department_ids.includes(subDepartment.id)
  );

  return (
    <section>
      <div className="-mt-6 mb-8">
        <NewDepartmentIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl mt-2 font-light">
          Details of <span className="font-medium">{subDepartment.name}</span>
        </h2>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-lg font-medium">Members</h3>
        <Separator className="mb-2 -mt-2" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subDeptMembers?.length > 0 ? (
            subDeptMembers.map((member) => (
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

export default SubDepartmentDetails;
