import { useDispatch, useSelector } from "react-redux";
import { archiveAdmin } from "../../services/adminService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AlertTriangle } from "lucide-react";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";

const ArchiveAdminAlert = () => {
  const dispatch = useDispatch();

  const adminInfo = useSelector((state) => state.dialog.props);

  const handleConfirm = function () {
    archiveAdmin(adminInfo?.id, dispatch).then(() => {
      dispatch(closeDialog());
    });
  };

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="text-destructive size-10" />

        <h2 className="text-xl font-semibold">Archive Admin</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to archive{" "}
          <span className="font-semibold">
            {adminInfo?.first_name + " " + adminInfo?.last_name}
          </span>
          ? This action cannot be undone.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveAdminAlert;
