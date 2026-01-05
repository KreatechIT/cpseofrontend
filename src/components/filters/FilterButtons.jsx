import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "../ui/button";

export const FilterButton = ({ onClick, ...props }) => {
  return (
    <Button onClick={onClick} {...props}>
      <SlidersHorizontal className="-ms-1" size={16} aria-hidden="true" />
      Filter
    </Button>
  );
};

export const ClearFilterButton = ({ onClick, ...props }) => {
  return (
    <Button variant="outline" onClick={onClick} {...props}>
      <X className="-ms-1 opacity-80" size={16} aria-hidden="true" />
      Clear Filters
    </Button>
  );
};
