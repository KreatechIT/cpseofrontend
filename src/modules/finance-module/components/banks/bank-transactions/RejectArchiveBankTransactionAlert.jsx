import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/reducers/dialogSlice";

import { ArchiveButtons } from "@/components/form-fields/FormButtons";
import {
  archiveBankTransaction,
  rejectBankTransaction,
} from "@/modules/finance-module/services/bankService";

const RejectArchiveBankTransactionAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { type: actionType, props: bankTransaction } = useSelector(
    (state) => state.dialog
  );

  const handleConfirm = function () {
    const action =
      actionType === "rejectBankTransaction"
        ? rejectBankTransaction(
            user?.organisation_id,
            bankTransaction?.id,
            dispatch
          )
        : archiveBankTransaction(
            user?.organisation_id,
            bankTransaction?.id,
            dispatch
          );

    action.then(() => {
      dispatch(closeDialog());
    });
  };
  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">
          {actionType === "rejectBankTransaction" ? "Reject" : "Archive"} Bank
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

export default RejectArchiveBankTransactionAlert;
