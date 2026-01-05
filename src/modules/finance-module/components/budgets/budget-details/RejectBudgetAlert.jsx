import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";
import { rejectBudget } from "@/modules/finance-module/services/budgetService";

const RejectBudgetAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { props: budget } = useSelector((state) => state.dialog);

  const handleConfirm = function () {
    rejectBudget(user.organisation_id, budget.id, dispatch).then(() => {
      dispatch(closeDialog());
    });
  };
  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Reject Budget</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to reject this budget? This action cannot be
          undone.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} showIcons={false} />
    </div>
  );
};

export default RejectBudgetAlert;
