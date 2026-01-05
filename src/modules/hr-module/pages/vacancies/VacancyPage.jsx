import usePermission from "@/hooks/usePermission";
import { useDispatch, useSelector } from "react-redux";
import { getAllVacancies } from "@/modules/hr-module/services/hiringVacancyService";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { CardSkeletons } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { getAllDepartments } from "@/modules/member-module/services/departmentService";
import VacancyFilters from "../../components/vacancies/VacancyFilters";

const VacancyPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { vacancies } = useSelector((state) => state.hiringVacancy);
  const { departments } = useSelector((state) => state.department);

  useEffect(() => {
    if (!vacancies) getAllVacancies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
  }, []);

  const getVacanciesFilteredData = (fromDate, toDate, department) => {
    getAllVacancies(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      department
    );
  };

  return (
    <>
      <title>Hiring Applicant Process - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading
            pageTitle="Hiring Applicant Process"
            withCardTableView={true}
          />
          <div className="">
            {hasPermission("hr_hiring_vacancy.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addVacancy",
                      styles: "md:min-w-[750px] xl:min-w-[850px]",
                    })
                  );
                }}
              >
                New Hiring <Plus />
              </Button>
            )}
          </div>
        </div>

        {vacancies ? (
          <VacancyFilters
            vacancies={vacancies}
            departments={departments}
            onFilter={getVacanciesFilteredData}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default VacancyPage;
