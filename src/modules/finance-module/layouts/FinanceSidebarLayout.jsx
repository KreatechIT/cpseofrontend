import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { Outlet } from "react-router-dom";
import usePermission from "@/hooks/usePermission";
import filterSidebarLinks from "@/utils/filterSidebarLinks";
import Header from "@/components/shared/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { hasHrProduct } from "@/utils/hasPermission";
import financeSidebarLinks from "./financeSidebarLinks";
import { getOrganisation } from "@/modules/member-module/services/organisationService";
import { MemberGlobalSearch } from "@/modules/member-module/components/member-search/MemberGlobalSearch";

const FinanceSidebarLayout = () => {
  const dispatch = useDispatch();
  const { hasPermission, hasAnyPermission, hasAllPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { organisation } = useSelector((state) => state.organisation);

  useEffect(() => {
    if (!organisation) getOrganisation(user?.organisation_id, dispatch);
  }, []);

  // Checks if Organiation has Finance and HR Products. if not then remove those links
  const modifiedSidebarLinks = financeSidebarLinks.map((group) => {
    if (group.groupTitle === "Other Links") {
      return {
        ...group,
        children: group.children.filter((item) => {
          if (item.title === "HR Management") {
            return hasHrProduct(organisation?.products);
          }
          return true;
        }),
      };
    }
    return group;
  });

  // Filter the sidebar links using current permissions
  const filteredSidebarLinks = filterSidebarLinks(modifiedSidebarLinks, {
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
  });

  return (
    <SidebarProvider>
      <AppSidebar sidebarLinks={filteredSidebarLinks} />

      <SidebarInset className="m-3.5 flex flex-col">
        <Header>
          <MemberGlobalSearch />
        </Header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default FinanceSidebarLayout;
