import { NewDepartmentIcon } from "@/components/icons/Icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Grid2x2CheckIcon } from "lucide-react";
import { useSelector } from "react-redux";

const DepartmentDetails = () => {
  const department = useSelector((state) => state.dialog.props);
  const { subDepartments } = useSelector((state) => state.department);

  if (!department) {
    return (
      <p className="text-muted-foreground text-center">
        No department data available.
      </p>
    );
  }

  const departmentSubDepartments = subDepartments?.filter(
    (subDept) => subDept.department_id === department.id
  );

  return (
    <section>
      <div className="-mt-6 mb-8">
        <NewDepartmentIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl mt-2 font-light">
          Details of <span className="font-medium">{department.name}</span>
        </h2>
      </div>

      <div className="mt-6">
        <h3 className="mb-2 text-lg font-medium">Sub Departments</h3>
        <Separator className="mb-2 -mt-2" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departmentSubDepartments?.length > 0 ? (
            departmentSubDepartments.map((subDept) => (
              <Card
                className="dark:bg-card overflow-hidden rounded-xl bg-white py-2 shadow-none"
                key={subDept.id}
              >
                <CardContent className="px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 rounded-full border border-black/10">
                      <AvatarFallback className="dark:bg-white/10">
                        <Grid2x2CheckIcon
                          size={20}
                          className="opacity-60"
                          aria-hidden="true"
                        />
                      </AvatarFallback>
                    </Avatar>
                    {subDept?.name}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No departments.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DepartmentDetails;
