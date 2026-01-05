import usePermission from "@/hooks/usePermission";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompanies } from "../services/companyService";
import {
  getAllDepartments,
  getAllSubDepartments,
} from "../services/departmentService";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SubDepartmentFilters from "../components/sub-departments/SubDepartmentFilters";
import { CardSkeletons } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/shared/PageHeading";

const SubDepartmentPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.company);
  const { departments, subDepartments } = useSelector(
    (state) => state.department
  );

  // Fetch members and roles
  useEffect(() => {
    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
    if (!subDepartments) getAllSubDepartments(user?.organisation_id, dispatch);
  }, []);

  return (
    <>
      <title>Sub Departments - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Sub Departments" withCardTableView={true} />
          <div className="flex gap-2.5 items-center">
            {hasPermission("department.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addSubDepartment",
                      styles: "md:min-w-[650px]",
                    })
                  );
                }}
              >
                Add Sub Department <Plus />
              </Button>
            )}
          </div>
        </div>

        {companies && departments && subDepartments ? (
          <SubDepartmentFilters
            departments={departments}
            subDepartments={subDepartments}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default SubDepartmentPage;
