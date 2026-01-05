import { CardViewIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import { setViewMode } from "@/store/reducers/uiSlice";
import { List } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export const PageHeading = ({
  pageTitle,
  withCardTableView = false,
  children,
}) => {
  return (
    <div className="flex items-center gap-2">
      <h2 className="font-sans text-2xl font-medium">
        {children ? children : pageTitle}
      </h2>
      {withCardTableView && <CardTableViewButton />}
    </div>
  );
};

const CardTableViewButton = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector((state) => state.ui.viewMode);

  return viewMode === "card" ? (
    <Button
      variant="outline"
      className="scale-90 rounded-lg"
      onClick={() => dispatch(setViewMode("table"))}
    >
      <List /> Table View
    </Button>
  ) : (
    <Button
      variant="outline"
      className="scale-90 rounded-lg"
      onClick={() => dispatch(setViewMode("card"))}
    >
      <CardViewIcon /> Card View
    </Button>
  );
};
