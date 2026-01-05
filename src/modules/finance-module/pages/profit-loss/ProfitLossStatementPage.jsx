import { useDispatch, useSelector } from "react-redux";
import { getProfitLossReport } from "../../services/profitLossService";
import { useEffect } from "react";
import { PageHeading } from "@/components/shared/PageHeading";
import ProfitLossStatementFilters from "../../components/profit-loss/ProfitLossStatementFilters";
import { getAllCompanies } from "@/modules/member-module/services/companyService";
import { getAllDepartments } from "@/modules/member-module/services/departmentService";

const ProfitLossStatementPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profitLossData } = useSelector((state) => state.profitLoss);
  const { companies } = useSelector((state) => state.company);
  const { departments } = useSelector((state) => state.department);

  // Fetch Profit and Loss Statement Data.
  useEffect(() => {
    if (!profitLossData) getProfitLossReport(user.organisation_id, dispatch);

    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
  }, []);

  const getPlFilteredData = (fromDate, toDate, company, department) => {
    getProfitLossReport(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      company,
      department
    );
  };

  return (
    <>
      <title>Profit & Loss Statement - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading
            pageTitle="Profit & Loss Statement"
            withCardTableView={false}
          />

          <div className="flex gap-2"></div>
        </div>

        {profitLossData && companies && departments && (
          <ProfitLossStatementFilters
            plStatementData={profitLossData}
            companies={companies}
            departments={departments}
            onFilter={getPlFilteredData}
          />
        )}
      </main>
    </>
  );
};

export default ProfitLossStatementPage;
