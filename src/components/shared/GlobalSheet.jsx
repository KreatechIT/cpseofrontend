import usePreventAutoFocus from "@/hooks/usePreventAutoFocus";
import sheetRegistry from "@/lib/sheetRegistry";
import { useDispatch, useSelector } from "react-redux";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import { toggleSheetOpen } from "@/store/reducers/sheetSlice";

const GlobalSheet = () => {
  const dispatch = useDispatch();

  // Get sheet state from Redux store
  const { isOpen, type, styles } = useSelector((state) => state.sheet);

  // Custom hook to prevent auto-focus on sheet open
  const prevent = usePreventAutoFocus();

  // Resolve component dynamically from registry
  const Component = type ? sheetRegistry[type] : null;

  // This is a controlled Sheet.
  const handleOpenChange = (sheetState) => {
    dispatch(toggleSheetOpen(sheetState));
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        {...prevent}
        className={cn(
          "overflow-y-auto rounded-lg border-2 bg-white/90 md:min-w-[650px] lg:min-w-[750px] xl:min-w-[850px] dark:bg-[#131313]",
          styles // Allow passing additional styles from Redux
        )}
      >
        <SheetHeader>
          <SheetTitle />
          <SheetDescription />
        </SheetHeader>

        {/* Render dynamic sheet component and send props if available */}
        {Component && <Component />}
      </SheetContent>
    </Sheet>
  );
};

export default GlobalSheet;
