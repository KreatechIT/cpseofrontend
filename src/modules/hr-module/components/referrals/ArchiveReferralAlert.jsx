import { ArchiveButtons } from "@/components/form-fields/FormButtons";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import { archiveReferral } from "../../services/referralService";

const ArchiveReferralAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const referralInfo = useSelector((state) => state.dialog.props);

  const handleConfirm = function () {
    archiveReferral(user?.organisation_id, referralInfo?.id, dispatch).then(
      () => {
        dispatch(closeDialog());
      }
    );
  };

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="text-destructive size-10" />

        <h2 className="text-xl font-semibold">Archive Referral</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to archive this referral? This action cannot be
          undone. Make sure you have backed up any necessary information before
          proceeding.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveReferralAlert;
