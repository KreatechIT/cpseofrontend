import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { Outlet } from "react-router-dom";
import adminSidebarLinks from "./adminSidebarLinks";
import usePermission from "@/hooks/usePermission";
import filterSidebarLinks from "@/utils/filterSidebarLinks";
import Header from "@/components/shared/Header";
import GlobalAdminSearch from "../components/admin-search/GlobalAdminSearch";

const AdminSidebarLayout = () => {
  const { hasPermission, hasAnyPermission, hasAllPermission } = usePermission();

  // Filter the sidebar links using current permissions
  const filteredSidebarLinks = filterSidebarLinks(adminSidebarLinks, {
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
  });

  return (
    <SidebarProvider>
      <AppSidebar sidebarLinks={filteredSidebarLinks} />

      <SidebarInset className="m-3.5 flex flex-col">
        <Header>
          <GlobalAdminSearch />
        </Header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminSidebarLayout;
