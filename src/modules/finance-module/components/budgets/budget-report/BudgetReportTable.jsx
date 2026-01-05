import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect, useState } from "react";

const BudgetReportTable = ({ data }) => {
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const initialState = {};
    data.forEach((_, idx) => {
      initialState[idx] = true;
    });
    setExpanded(initialState);
  }, [data]);

  const toggleStrategy = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Budget Category</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Unit</TableHead>

            <TableHead>Budget</TableHead>

            <TableHead>Actual Cost</TableHead>
            <TableHead>Budget Balance</TableHead>
            <TableHead>Total Budget</TableHead>
            <TableHead>Total Actual Cost</TableHead>
            <TableHead>Total Budget Balance</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((dept, deptIndex) => {
            const isOpen = expanded[deptIndex];
            const rowSpan = dept.items.length;

            return (
              <React.Fragment key={deptIndex}>
                <TableRow
                  className="bg-primary/10 cursor-pointer "
                  onClick={() => toggleStrategy(deptIndex)}
                >
                  <TableCell colSpan={12} className="font-semibold py-4">
                    Strategy: {dept.strategy}{" "}
                    <span className="float-right">{isOpen ? "▲" : "▼"}</span>
                  </TableCell>
                </TableRow>

                {isOpen &&
                  dept.items.map((item, itemIndex) => (
                    <TableRow key={itemIndex}>
                      <TableCell className="py-3">
                        {item.budget_category}
                      </TableCell>
                      <TableCell className="border border-black/10 dark:border-white/10">
                        {item.submitted_by || " - "}
                      </TableCell>
                      <TableCell className="border border-black/10 dark:border-white/10">
                        {formatCurrency(item.unit)}
                      </TableCell>

                      <TableCell className="border border-black/10 dark:border-white/10">
                        {formatCurrency(item?.budget)}
                      </TableCell>

                      <TableCell className="border border-black/10 dark:border-white/10 whitespace-pre-wrap">
                        {formatCurrency(item?.actual_cost)}
                      </TableCell>
                      <TableCell className="border border-black/10 dark:border-white/10 whitespace-pre-wrap">
                        {formatCurrency(item?.budget_balance)}
                      </TableCell>

                      {itemIndex === 0 && (
                        <>
                          {dept.payments?.length ? (
                            <>
                              <TableCell
                                className="border border-black/10 dark:border-white/10"
                                rowSpan={rowSpan}
                              >
                                {dept.payments?.length
                                  ? dept.payments.map((p, i) => (
                                      <div key={i} className="py-2 border-y">
                                        {formatCurrency(p.total_budget)}
                                      </div>
                                    ))
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className="border border-black/10 dark:border-white/10"
                                rowSpan={rowSpan}
                              >
                                {dept.payments?.length
                                  ? dept.payments.map((p, i) => (
                                      <div key={i} className="py-2 border-y">
                                        {formatCurrency(p.total_actual_cost)}
                                      </div>
                                    ))
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className="border border-black/10 dark:border-white/10"
                                rowSpan={rowSpan}
                              >
                                {dept.payments?.length
                                  ? dept.payments.map((p, i) => (
                                      <div key={i} className="py-2 border-y">
                                        {formatCurrency(p.total_budget_balance)}
                                      </div>
                                    ))
                                  : "-"}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell
                                className="border border-black/10 dark:border-white/10"
                                rowSpan={rowSpan}
                              >
                                {formatCurrency(dept.payments.total_budget)}
                              </TableCell>
                              <TableCell
                                className="border border-black/10 dark:border-white/10"
                                rowSpan={rowSpan}
                              >
                                {formatCurrency(
                                  dept.payments.total_actual_cost
                                )}
                              </TableCell>
                              <TableCell
                                className="border border-black/10 dark:border-white/10"
                                rowSpan={rowSpan}
                              >
                                {formatCurrency(
                                  dept.payments.total_budget_balance
                                )}
                              </TableCell>
                            </>
                          )}
                        </>
                      )}
                    </TableRow>
                  ))}
              </React.Fragment>
            );
          })}

          {data.length === 0 && (
            <TableRow>
              <TableCell className="py-2 text-center" colSpan={12}>
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default BudgetReportTable;
