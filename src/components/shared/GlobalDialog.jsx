import usePreventAutoFocus from "@/hooks/usePreventAutoFocus";
import dialogRegistry from "@/lib/dialogRegistry";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";
import { toggleDialogOpen } from "@/store/reducers/dialogSlice";
import { Suspense } from "react";

const GlobalDialog = () => {
  const dispatch = useDispatch();

  // Get dialog state from Redux store
  const { isOpen, type, styles } = useSelector((state) => state.dialog);

  // Custom hook to prevent auto-focus on dialog open
  const prevent = usePreventAutoFocus();

  // Resolve component dynamically from registry
  const Component = type ? dialogRegistry[type] : null;

  // This is a controlled Dialog.
  const handleOpenChange = (dialogState) => {
    dispatch(toggleDialogOpen(dialogState));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        {...prevent}
        className={cn(
          "max-h-[80vh] md:max-h-[85vh] xl:max-h-[90vh] overflow-y-auto rounded-lg border-2 bg-white/90 md:min-w-[650px] dark:bg-[#131313]",
          styles // Allow passing additional styles from Redux
        )}
      >
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>

        {/* Render dynamic dialog component and send props if available */}
        {Component && (
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalDialog;
