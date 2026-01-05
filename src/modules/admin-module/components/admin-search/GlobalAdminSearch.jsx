import usePermission from "@/hooks/usePermission";
import {
  setDialogData,
  toggleSeachDialogOpen,
} from "@/store/reducers/dialogSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const GlobalAdminSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasPermission, hasAnyPermission } = usePermission();

  return (
    <>
      <CommandGroup>
        <CommandItem
          onSelect={() => {
            navigate("/user-access/organisation/all-organisations");
            dispatch(toggleSeachDialogOpen(false));
          }}
        >
          <span>Admin Dashboard</span>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup
        heading={
          hasAnyPermission(["organisation.read", "organisation.add"])
            ? "Organisations"
            : ""
        }
      >
        {hasPermission("organisation.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/user-access/organisation/all-organisations");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Organisations</span>
          </CommandItem>
        )}

        {hasPermission("organisation.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addOrganisation",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Organisation</span>
            <PlusIcon />
          </CommandItem>
        )}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup
        heading={
          hasAnyPermission(["admin.read", "admin.add", "role.read", "role.add"])
            ? "Admins"
            : ""
        }
      >
        {hasPermission("admin.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/user-access/admin/all-admins");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Admins</span>
          </CommandItem>
        )}

        {hasPermission("admin.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addAdmin",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Admin</span>
            <PlusIcon />
          </CommandItem>
        )}

        {hasPermission("role.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/user-access/admin/roles");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Admin Roles</span>
          </CommandItem>
        )}

        {hasPermission("role.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addAdminRole",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Admin Role</span>
            <PlusIcon />
          </CommandItem>
        )}
      </CommandGroup>
    </>
  );
};

export default GlobalAdminSearch;
