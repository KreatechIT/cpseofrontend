import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AlertTriangleIcon } from "lucide-react";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";
import {
  archiveTransaction,
  rejectTransaction,
} from "@/modules/finance-module/services/transactionService";

const TransactionRejectArchiveAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { type: actionType, props: transaction } = useSelector(
    (state) => state.dialog
  );

  const handleConfirm = function () {
    const action =
      actionType === "rejectTransaction"
        ? rejectTransaction(user.organisation_id, transaction.id, dispatch)
        : archiveTransaction(user.organisation_id, transaction.id, dispatch);

    action.then(() => {
      dispatch(closeDialog());
    });
  };

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangleIcon className="text-destructive size-10" />

        <h2 className="text-xl font-semibold">
          {actionType === "rejectTransaction" ? "Reject" : "Archive"}{" "}
          Transaction
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to{" "}
          {actionType === "rejectTransaction" ? "reject" : "archive"} this? This
          action cannot be undone.
        </p>
      </div>

      <ArchiveButtons
        handleConfirm={handleConfirm}
        showIcons={actionType === "archiveTransaction"}
      />
    </div>
  );
};

export default TransactionRejectArchiveAlert;
