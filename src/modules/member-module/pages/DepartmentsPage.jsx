import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";

import { getAllCompanies } from "../services/companyService";
import {
  getAllDepartments,
  getAllSubDepartments,
} from "../services/departmentService";
import DepartmentFilters from "../components/departments/DepartmentFilters";

const DepartmentPage = () => {
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
      <title>Departments - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Departments" withCardTableView={true} />
          <div className="flex gap-2.5 items-center">
            {hasPermission("department.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addDepartment",
                      styles: "md:min-w-[650px]",
                    })
                  );
                }}
              >
                Add Department <Plus />
              </Button>
            )}
          </div>
        </div>

        {companies && departments && subDepartments ? (
          <DepartmentFilters
            companies={companies}
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

export default DepartmentPage;
