import { useDispatch, useSelector } from "react-redux";
import { archiveDepartment } from "../../services/departmentService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AlertTriangle } from "lucide-react";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";

const ArchiveDepartmentAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const departmentInfo = useSelector((state) => state.dialog.props);

  const handleConfirm = function () {
    archiveDepartment(user?.organisation_id, departmentInfo?.id, dispatch).then(
      () => {
        dispatch(closeDialog());
      }
    );
  };

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="text-destructive size-10" />

        <h2 className="text-xl font-semibold">Archive Department</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to archive{" "}
          <span className="font-semibold">{departmentInfo?.name}</span>? This
          action cannot be undone.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Archiving this department will also archive all its associated data.
          Make sure you have backed up any necessary information before
          proceeding.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveDepartmentAlert;
