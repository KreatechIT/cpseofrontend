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
import jobHiringSidebarLinks from "./hiringSidebarLinks";
import { getAllJobPosts } from "../services/jobsService";
import { MemberGlobalSearch } from "@/modules/member-module/components/member-search/MemberGlobalSearch";

const HiringSidebarLayout = () => {
  const dispatch = useDispatch();
  const { hasPermission, hasAnyPermission, hasAllPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { organisation } = useSelector((state) => state.organisation);
  const { jobPosts } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (!organisation) getOrganisation(user?.organisation_id, dispatch);
    if (!jobPosts) getAllJobPosts(user?.organisation_id, dispatch);
  }, []);

  // Checks if Organiation has Finance and HR Products. if not then remove those links
  const modifiedSidebarLinks = jobHiringSidebarLinks.map((group) => {
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
  let filteredSidebarLinks = filterSidebarLinks(modifiedSidebarLinks, {
    hasPermission,
    hasAnyPermission,
    hasAllPermission,
  });

  // count number of active jobs
  const activeJobCount = jobPosts?.filter(
    (job) => job.status === "Active"
  ).length;

  filteredSidebarLinks = filteredSidebarLinks.map((group) => {
    return {
      ...group,
      children: group.children?.map((item) => {
        // Check for Recruitment Process level
        if (
          item.title === "Recruitment Process" &&
          Array.isArray(item.children)
        ) {
          return {
            ...item,
            children: item.children.map((child) => {
              if (child.title === "Jobs") {
                return {
                  ...child,
                  content: (
                    <div className="bg-primary text-primary-foreground size-5 aspect-square flex justify-center items-center rounded-full ml-auto text-xs">
                      {activeJobCount}
                    </div>
                  ),
                };
              }
              return child;
            }),
          };
        }
        return item;
      }),
    };
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

export default HiringSidebarLayout;
