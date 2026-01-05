import { closeDialog } from "@/store/reducers/dialogSlice";
import { Check, LoaderCircle, TrashIcon, XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

export const FormButtons = function ({ isSubmitting }) {
  const dispatch = useDispatch();

  return (
    <div className="md:col-span-2 mt-6 grid grid-cols-2 gap-4">
      <Button
        variant="secondary"
        type="button"
        className="border/50 border bg-white dark:bg-white/5"
        disabled={isSubmitting}
        onClick={() => dispatch(closeDialog())}
      >
        <XIcon className="-ms-1 opacity-80" size={16} aria-hidden="true" />
        Cancel
      </Button>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <LoaderCircle
            className="-ms-1 animate-spin opacity-80"
            size={16}
            aria-hidden="true"
          />
        ) : (
          <Check className="-ms-1 opacity-80" size={16} aria-hidden="true" />
        )}
        Confirm
      </Button>
    </div>
  );
};

export const ArchiveButtons = ({ handleConfirm, showIcons = true }) => {
  const dispatch = useDispatch();
  return (
    <div className="mt-6 flex justify-end gap-4">
      <Button
        variant="outline"
        onClick={() => dispatch(closeDialog())}
        className="rounded-md border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        {showIcons && (
          <XIcon className="-ms-1 opacity-80" size={16} aria-hidden="true" />
        )}
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleConfirm}>
        {showIcons && (
          <TrashIcon
            className="-ms-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
        )}
        Confirm
      </Button>
    </div>
  );
};
