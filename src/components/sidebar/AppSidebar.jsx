import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import SidebarUser from "./SidebarUser";

const AppSidebar = ({ sidebarLinks }) => {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar(); // Sidebar open/collapse state and toggler

  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* Sidebar Header with brand and toggle button */}
      <SidebarHeader className="mt-3 pl-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h2
              className={cn(
                "text-xl font-semibold",
                state != "expanded" && "hidden" // Hide text when sidebar is collapsed
              )}
            >
              CorePath360
            </h2>
          </Link>

          {/* Sidebar Collapse/Expand Button */}
          <Button
            className={cn(
              "scale-80 rounded-md p-5",
              state === "collapsed" && "-ml-2.5"
            )}
            size="icon"
            onClick={toggleSidebar}
          >
            <ChevronRightIcon
              className={cn(
                "size-8 shrink-0 stroke-white",
                state === "expanded" && "rotate-180" // Rotate icon when expanded
              )}
            />
          </Button>
        </div>
      </SidebarHeader>

      {/* Main Sidebar Content with Menu */}
      <SidebarContent className={cn("px-2.5", state === "expanded" && "mt-6")}>
        {sidebarLinks.map((sidebarLinksGroup, index) => (
          <SidebarMenu key={index} className="gap-y-2">
            {sidebarLinksGroup.groupTitle && (
              // Optional group label
              <SidebarGroupLabel className="mt-1.5 -mb-1">
                {sidebarLinksGroup.groupTitle}
              </SidebarGroupLabel>
            )}

            {/* Iterate sidebar items */}
            {sidebarLinksGroup.children.map((sidebarLink) =>
              sidebarLink.children ? (
                // If item has children, render collapsible sub-menu
                <Collapsible
                  key={sidebarLink.title}
                  asChild
                  defaultOpen={location.pathname.includes(sidebarLink.path)} // Open if current path matches
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {/* Trigger for collapsible */}
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={sidebarLink.title}
                        className={cn(
                          "rounded-md p-2.5 transition-all duration-300",
                          location.pathname.includes(sidebarLink.path)
                            ? "bg-primary text-white hover:bg-blue-700 hover:text-white data-[state=open]:hover:bg-blue-700 data-[state=open]:hover:text-white"
                            : "hover:bg-blue-100 dark:hover:bg-black/20"
                        )}
                      >
                        {/* Optional icon */}
                        {sidebarLink.icon && (
                          <sidebarLink.icon
                            className={cn(
                              "scale-125",
                              location.pathname.includes(sidebarLink.path)
                                ? "fill-white"
                                : "fill-primary"
                            )}
                          />
                        )}
                        <span>{sidebarLink.title}</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {/* Submenu Items */}
                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-1 px-0">
                        {sidebarLink.children?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "rounded-none border-l-3 border-l-transparent p-2.5 transition-all duration-300",
                                location.pathname === subItem.path
                                  ? "border-l-primary bg-primary/10 hover:bg-primary/20"
                                  : "hover:bg-blue-100 dark:hover:bg-black/20"
                              )}
                            >
                              <Link
                                to={subItem.path}
                                className="inline-flex justify-between w-full"
                              >
                                <span>{subItem.title}</span> {subItem?.content}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // Render simple menu item without children
                <SidebarMenuItem key={sidebarLink.title}>
                  <SidebarMenuButton
                    tooltip={sidebarLink.title}
                    asChild
                    className={cn(
                      "rounded-md p-2.5 transition-all duration-300",
                      location.pathname === sidebarLink.path
                        ? "bg-primary text-white hover:bg-blue-700 hover:text-white"
                        : "hover:bg-blue-100 dark:hover:bg-black/20"
                    )}
                  >
                    <Link to={sidebarLink.path}>
                      <sidebarLink.icon
                        className={cn(
                          "scale-125",
                          location.pathname === sidebarLink.path
                            ? "fill-white"
                            : "fill-[#3872FA]"
                        )}
                      />
                      <span>{sidebarLink.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        ))}
      </SidebarContent>

      {/* Sidebar Footer with User Info */}
      <SidebarFooter
        className={cn(
          "mx-auto mb-2 ml-0.5 w-full",
          state === "expanded" && "ml-0"
        )}
      >
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
