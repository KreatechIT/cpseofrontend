import { closeDialog } from "@/store/reducers/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangleIcon } from "lucide-react";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";
import { archiveAdminRole } from "../../services/adminService";

const ArchiveAdminRole = () => {
  const dispatch = useDispatch();
  const adminRoleInfo = useSelector((state) => state.dialog.props);

  const handleConfirm = function () {
    archiveAdminRole(adminRoleInfo?.id, dispatch).then(() => {
      dispatch(closeDialog());
    });
  };
  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangleIcon className="text-destructive size-10" />

        <h2 className="text-xl font-semibold">Archive Admin Role</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 w-full">
          Are you sure you want to archive{" "}
          <span className="font-semibold">{adminRoleInfo?.name}</span>? This
          action cannot be undone.
        </p>

        {adminRoleInfo.roleCount > 0 && (
          <p className="-mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            Currently {adminRoleInfo.roleCount} member
            {adminRoleInfo.roleCount > 1 ? "s are" : " is"} using this role. All
            of their permissions will be reset.
          </p>
        )}
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveAdminRole;
