import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { useState } from "react";

const colNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Total",
];

const ProfitLossStatementTable = ({ data }) => {
  return (
    <div className="overflow-x-auto max-w-full rounded-lg relative text-sm">
      <div className="max-h-[calc(100vh-225px)] overflow-y-scroll">
        <table className="min-w-max w-full border-collapse">
          <thead
            className="bg-muted"
            style={{ position: "sticky", top: 0, zIndex: 50 }}
          >
            <tr className="border-b">
              <th className="sticky left-0 z-50 ps-4 py-3 border-r border-border text-left text-sm font-medium text-muted-foreground bg-muted">
                Months
              </th>
              {colNames.map((month) => (
                <th
                  key={month}
                  className="relative z-10 px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  style={{ position: "sticky", top: 0, zIndex: 20 }}
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((group, idx) => (
              <MainGroup key={idx} group={group} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitLossStatementTable;

const MainGroup = ({ group }) => {
  const [open, setOpen] = useState(group.name.includes("Ratio") ? false : true); // Groups which have Ratio in their name will be collapsed by default. e.g. Expenses Ratio and Profit Loss Ratio
  const { name, ...rest } = group;

  return (
    <>
      <tr className="border-b">
        <td
          onClick={() => setOpen(!open)}
          className={cn(
            "sticky left-0 z-20 bg-primary/5 cursor-pointer font-bold py-3 ps-4 border-r",
            "w-80"
          )}
        >
          {open ? "▼" : "▶"} <span className="ml-4">{name}</span>
        </td>
        {colNames.map((_, i) => (
          <td key={i} className="bg-primary/5 px-4 py-3 z-10 relative" />
        ))}
      </tr>
      {open &&
        Object.entries(rest).map(([key, value], index) => (
          <RecursiveRow
            key={key}
            name={key}
            value={value}
            numbering={`${index + 1}`}
            level={1}
          />
        ))}
    </>
  );
};

const RecursiveRow = ({ name, value, numbering, level }) => {
  const [open, setOpen] = useState(true);

  const hasMonthData =
    value &&
    typeof value === "object" &&
    colNames.some((month) => month in value);

  const childEntries = Object.entries(value || {}).filter(
    ([k]) => !colNames.includes(k) && k !== "name"
  );

  const isGroup = childEntries.length > 0;

  return (
    <>
      <tr
        className={cn(
          "border-b",
          name === "Earnings" ||
            name === "Total Expenses" ||
            (name === "Gross Profit" && numbering == 8)
            ? "border-t-2 border-t-black/75 dark:border-t-white/75"
            : ""
        )}
      >
        <td
          onClick={isGroup ? () => setOpen(!open) : undefined}
          className={cn(
            "sticky left-0 z-10 bg-background px-4 py-2.5 border-r",
            isGroup ? "cursor-pointer font-semibold" : ""
          )}
          style={{ paddingLeft: `${level * 30}px` }}
        >
          {isGroup ? (open ? "▼" : "▶") : ""}
          <span className={cn(isGroup ? "ml-4 font-semibold" : "ml-6")}>
            {numbering}
          </span>
          <span className="ml-4">{name}</span>
        </td>
        {hasMonthData
          ? colNames.map((month) => (
              <td
                key={month}
                className={`${getColorClass(value[month])} px-4 py-2.5`}
              >
                {typeof value[month] === "number"
                  ? formatCurrency(value[month])
                  : value[month] ?? ""}
              </td>
            ))
          : colNames.map((_, i) => (
              <td key={i} className="bg-background px-4 py-2.5" />
            ))}
      </tr>
      {isGroup &&
        open &&
        childEntries.map(([subKey, subVal], i) => (
          <RecursiveRow
            key={subKey}
            name={subKey}
            value={subVal}
            numbering={`${numbering}.${i + 1}`}
            level={level + 1}
          />
        ))}
    </>
  );
};

const getColorClass = (val) => {
  let num;
  if (typeof val === "number") {
    num = val;
  } else if (typeof val === "string" && val.includes("%")) {
    num = parseFloat(val.replace("%", ""));
  } else {
    return "";
  }

  if (num < 0) return "text-destructive";
  if (num === 0) return "";
  if (num > 0) return "text-green-700 dark:text-green-400/90";
  return "";
};
