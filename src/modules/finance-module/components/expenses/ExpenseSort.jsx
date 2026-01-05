import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, LoaderCircle, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { closeDialog } from "@/store/reducers/dialogSlice";
import {
  sortAllExpenseCategories,
  sortAllExpenseSubCategories,
  sortAllExpenseSubSubCategories,
} from "../../../../modules/finance-module/services/expensesCategoryService";

const SortableRow = ({ row }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="border-b-black/10 dark:border-b-white/5"
    >
      <TableCell className="w-10 px-2 text-gray-400">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-black dark:hover:text-white"
        >
          <GripVertical size={18} />
        </span>
      </TableCell>
      <TableCell className="px-2">{row.name}</TableCell>
    </TableRow>
  );
};

const ExpensesSort = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { type: dialogType, props: data } = useSelector(
    (state) => state.dialog
  );

  const [sortedList, setSortedList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setSortedList(data || []);
    setOriginalList(data || []);
  }, [data]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedList.findIndex((item) => item.id === active.id);
    const newIndex = sortedList.findIndex((item) => item.id === over.id);

    const updated = [...sortedList];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);
    setSortedList(updated);

    const changed = updated.some(
      (item, idx) => item.id !== originalList[idx]?.id
    );
    setHasChanges(changed);
  };

  const handleSaveChanges = () => {
    const payload = sortedList.map((item, index) => ({
      category_id: item.id,
      sort_order: index + 1,
    }));

    let sortAction;
    if (dialogType === "sortExpenseCategory") {
      sortAction = sortAllExpenseCategories;
    } else if (dialogType === "sortExpenseSubCategory") {
      sortAction = sortAllExpenseSubCategories;
    } else if (dialogType === "sortExpenseSubSubCategory") {
      sortAction = sortAllExpenseSubSubCategories;
    }

    if (sortAction) {
      sortAction(
        user.organisation_id,
        { categories: payload },
        setIsSaving,
        dispatch
      ).then(() => {
        dispatch(closeDialog());
      });
      setHasChanges(false);
    }
  };

  const getTitle = () => {
    switch (dialogType) {
      case "sortExpenseCategory":
        return "Sort Expense Category";
      case "sortExpenseSubCategory":
        return "Sort Expense Sub Category";
      case "sortExpenseSubSubCategory":
        return "Sort Expense Sub Sub Category";
      default:
        return "Sort Expenses";
    }
  };

  return (
    <div>
      <div className="-mt-6 mb-8">
        <h2 className="mt-2 text-center text-xl font-medium">{getTitle()}</h2>
      </div>

      <div className="overflow-hidden rounded-lg">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader className="bg-gray-100/75 dark:bg-[#dcdcdc]/10">
              <TableRow>
                <TableHead className="w-10 px-2"></TableHead>
                <TableHead className="px-2">Name</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <SortableContext
                items={sortedList.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedList.length > 0 ? (
                  sortedList.map((row) => (
                    <SortableRow key={row.id} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="py-4 text-center">
                      No data to sort
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>

        {hasChanges && (
          <div className="col-span-2 mt-6 grid grid-cols-2 gap-4">
            <Button
              variant="secondary"
              type="button"
              className="border/50 border bg-white dark:bg-white/5"
              disabled={isSaving}
              onClick={() => dispatch(closeDialog(false))}
            >
              <XIcon
                className="-ms-1 opacity-80"
                size={16}
                aria-hidden="true"
              />
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isSaving}
              onClick={handleSaveChanges}
            >
              {isSaving ? (
                <LoaderCircle
                  className="-ms-1 animate-spin opacity-80"
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                <Check
                  className="-ms-1 opacity-80"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesSort;
