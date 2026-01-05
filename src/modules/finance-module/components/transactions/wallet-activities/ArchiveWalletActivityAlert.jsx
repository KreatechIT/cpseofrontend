import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AlertTriangleIcon } from "lucide-react";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";
import { archiveWalletActivity } from "@/modules/finance-module/services/transactionService";

const ArchiveWalletActivityAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const walletActivity = useSelector((state) => state.dialog.props);

  const handleConfirm = function () {
    archiveWalletActivity(
      user?.organisation_id,
      walletActivity?.id,
      dispatch
    ).then(() => {
      dispatch(closeDialog());
    });
  };
  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangleIcon className="text-destructive size-10" />

        <h2 className="text-xl font-semibold">Archive Wallet Activity</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to archive this? This action cannot be undone.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveWalletActivityAlert;
