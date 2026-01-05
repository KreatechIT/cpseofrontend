import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdmins, getAllAdminRoles } from "../services/adminService";
import {
  getAllOrganisations,
  getOrganisationProducts,
} from "../services/organisationByAdminService";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeading } from "@/components/shared/PageHeading";
import VisitorsChart from "@/modules/admin-module/components/dashboard/VisitorsChart";

import ProductsBarChart from "@/modules/admin-module/components/dashboard/ProductsBarChart";
import RecentActivity from "../components/dashboard/RecentActivity";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { admins, adminRoles } = useSelector((state) => state.admins);
  const { organisations, organisationProducts } = useSelector(
    (state) => state.organisationsByAdmin
  );

  // Fetch Admins, Admin Roles, Organisations, and Products
  useEffect(() => {
    if (!admins) getAllAdmins(dispatch);
    if (!adminRoles) getAllAdminRoles(dispatch);

    if (!organisations) getAllOrganisations(dispatch);
    if (!organisationProducts) getOrganisationProducts(dispatch);
  }, []);

  return (
    <>
      <title>Admin Dashboard - Core360</title>

      <main className="@container mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Admin Dashboard" withCardTableView={false} />
        </div>

        <section className="mt-4 flex flex-col gap-4 @3xl:flex-row mb-6">
          <div className="@container w-full flex-grow">
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-none">
                <CardContent className="flex flex-col items-start justify-center py-7">
                  <p className="text-foreground text-5xl font-bold">
                    {organisations?.length || 0}
                  </p>
                  <span className="text-muted-foreground text-sm">
                    Organisations
                  </span>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="flex flex-col items-start justify-center py-7">
                  <p className="text-foreground text-5xl font-bold">
                    {organisationProducts?.length || 0}
                  </p>
                  <span className="text-muted-foreground text-sm">
                    Products
                  </span>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="flex flex-col items-start justify-center py-7">
                  <p className="text-foreground text-5xl font-bold">
                    {admins?.length || 0}
                  </p>
                  <span className="text-muted-foreground text-sm">Admins</span>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="flex flex-col items-start justify-center py-7">
                  <p className="text-foreground text-5xl font-bold">
                    {adminRoles?.length || 0}
                  </p>
                  <span className="text-muted-foreground text-sm">
                    Admin Roles
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="w-full shrink-0 space-y-4 @3xl:w-100 xl:h-full">
            <ProductsBarChart />
          </div>
          <div className="w-full shrink-0 space-y-4 @3xl:w-100 @5xl:w-110 hidden @6xl:block">
            <RecentActivity />
          </div>
        </section>

        <VisitorsChart />
      </main>
    </>
  );
};

export default AdminDashboard;
