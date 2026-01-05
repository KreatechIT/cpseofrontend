import { useDispatch, useSelector } from "react-redux";
import { archiveCompany } from "../../services/companyService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AlertTriangleIcon } from "lucide-react";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";

const ArchiveCompanyAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const companyInfo = useSelector((state) => state.dialog.props);

  const handleConfirm = function () {
    archiveCompany(user?.organisation_id, companyInfo?.id, dispatch).then(
      () => {
        dispatch(closeDialog());
      }
    );
  };

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangleIcon className="text-destructive size-10" />

        <h2 className="text-xl font-semibold">Archive Company</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to archive{" "}
          <span className="font-semibold">{companyInfo?.name}</span>? This
          action cannot be undone.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Archiving this company will also archive all its associated data. Make
          sure you have backed up any necessary information before proceeding.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveCompanyAlert;
