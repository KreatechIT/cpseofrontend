import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronsUpDown,
  LogOut,
  SquareAsterisk,
  UserRoundIcon,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/modules/auth-module/services/authService";
import { cn } from "@/utils/cn";
import { setDialogData } from "@/store/reducers/dialogSlice";
import usePermission from "@/hooks/usePermission";
import { useNavigate } from "react-router-dom";

const SidebarUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, isMobile } = useSidebar(); // Hook to manage sidebar state
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full rounded-lg py-6",
                state === "expanded" &&
                  "border border-[#00022D]/5 dark:border-white/10"
              )}
            >
              {/* Component displaying user info */}
              <SidebarUserInfo user={user} />

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="font-primary w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <SidebarUserInfo user={user} />
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Checks if has admin reset (for admins) or member reset (for members) permission */}
            {hasPermission(
              user?.role === "ADMIN" ? "admin.reset" : "member.reset"
            ) && (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch(
                      setDialogData({
                        type:
                          user?.role === "ADMIN"
                            ? "resetAdminPassword"
                            : "resetMemberPassword", // DialogType depending on user
                        styles: "md:min-w-[650px]",
                        props:
                          user?.role === "ADMIN"
                            ? undefined
                            : { memberId: user.id },
                      })
                    )
                  }
                >
                  <SquareAsterisk />
                  Reset Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Logout */}
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarUser;

const SidebarUserInfo = ({ user }) => {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-full shadow-sm">
        <AvatarFallback className="border bg-black/5 dark:bg-white/10">
          <UserRoundIcon size={20} className="opacity-60" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {user?.first_name + " " + user?.last_name}
        </span>
        <span className="truncate text-xs">{user?.email}</span>
      </div>
    </>
  );
};
