import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { Outlet } from "react-router-dom";
import usePermission from "@/hooks/usePermission";
import filterSidebarLinks from "@/utils/filterSidebarLinks";
import Header from "@/components/shared/Header";
import memberSidebarLinks from "./memberSidebarLinks";
import { useSelector } from "react-redux";

import { hasFinanceProduct, hasHrProduct } from "@/utils/hasPermission";
import { MemberGlobalSearch } from "../components/member-search/MemberGlobalSearch";

const MemberSidebarLayout = () => {
  const { hasPermission, hasAnyPermission, hasAllPermission } = usePermission();
  const { organisation } = useSelector((state) => state.organisation);

  // Checks if Organiation has Finance and HR Products. if not then remove those links
  const modifiedSidebarLinks = memberSidebarLinks.map((group) => {
    if (group.groupTitle === "Other Links") {
      return {
        ...group,
        children: group.children.filter((item) => {
          if (item.title === "Finance Management") {
            return hasFinanceProduct(organisation?.products);
          }
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

export default MemberSidebarLayout;
