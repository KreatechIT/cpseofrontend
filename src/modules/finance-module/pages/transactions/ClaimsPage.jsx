import { getAllCompanies } from "@/modules/member-module/services/companyService";
import { getAllDepartments } from "@/modules/member-module/services/departmentService";
import usePermission from "@/hooks/usePermission";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClaims } from "../../services/claimService";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import ClaimsFilters from "../../components/transactions/claims/ClaimsFilters";
import { TableSkeleton } from "@/components/ui/skeleton";

const ClaimsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission, hasAnyPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { claims } = useSelector((state) => state.claims);
  const { companies } = useSelector((state) => state.company);
  const { departments } = useSelector((state) => state.department);

  // Fetch Wallet Activities Data.
  useEffect(() => {
    if (!claims) getAllClaims(user.organisation_id, dispatch);

    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
  }, []);

  const getClaimsFilteredData = (fromDate, toDate, company, department) => {
    getAllClaims(
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
      <title>Claims - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading
            pageTitle={
              hasAnyPermission([
                "finance_claim.hod_approve",
                "finance_claim.finance_approve",
              ])
                ? "Finance Transactions"
                : "Employee Transactions"
            }
            withCardTableView={false}
          />

          <div className="flex gap-2.5 items-center">
            {hasPermission("finance_claim.add") && (
              <>
                <Button
                  onClick={() => {
                    dispatch(
                      setDialogData({
                        type: "addEmployeeClaim",
                        styles: "md:min-w-[750px] lg:min-w-[850px]",
                      })
                    );
                  }}
                >
                  New Claim
                </Button>
              </>
            )}
          </div>
        </div>

        {claims && companies && departments ? (
          <ClaimsFilters
            claims={claims}
            companies={companies}
            departments={departments}
            onFilter={getClaimsFilteredData}
          />
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default ClaimsPage;
