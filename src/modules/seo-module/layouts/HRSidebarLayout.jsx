import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { Outlet } from "react-router-dom";
import usePermission from "@/hooks/usePermission";
import filterSidebarLinks from "@/utils/filterSidebarLinks";
import Header from "@/components/shared/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { hasFinanceProduct } from "@/utils/hasPermission";
import { getOrganisation } from "@/modules/member-module/services/organisationService";
import hrSidebarLinks from "./hrSidebarLinks";
import { MemberGlobalSearch } from "@/modules/member-module/components/member-search/MemberGlobalSearch";

const HRSidebarLayout = () => {
  const dispatch = useDispatch();
  const { hasPermission, hasAnyPermission, hasAllPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { organisation } = useSelector((state) => state.organisation);

  useEffect(() => {
    if (!organisation) getOrganisation(user?.organisation_id, dispatch);
  }, []);

  // Checks if Organiation has Finance and HR Products. if not then remove those links
  const modifiedSidebarLinks = hrSidebarLinks.map((group) => {
    if (group.groupTitle === "Other Links") {
      return {
        ...group,
        children: group.children.filter((item) => {
          if (item.title === "Finance Management") {
            return hasFinanceProduct(organisation?.products);
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

export default HRSidebarLayout;
