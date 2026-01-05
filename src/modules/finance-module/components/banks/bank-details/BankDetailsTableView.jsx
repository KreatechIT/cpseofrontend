import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BankActionButtons, BankThreeDotsDropdown } from "./BankDetailsBlocks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LandmarkIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSelector } from "react-redux";

const BankDetailsTableView = ({ filteredBanks }) => {
  const { currencyTypes } = useSelector((state) => state.banks);

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Bank</TableHead>

            <TableHead>Bank Number</TableHead>
            <TableHead>Bank Type</TableHead>
            <TableHead>Holder</TableHead>

            {/* <TableHead>Max Balance</TableHead> */}
            <TableHead>Total Balance</TableHead>
            <TableHead>Daily Limit</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredBanks.map((bank) => {
            const currencySymbol = currencyTypes?.find(
              (currency) => currency?.string === bank?.bank_currency
            ).symbol;

            return (
              <TableRow key={bank.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar
                      className={cn(
                        "h-10 w-10 rounded-full border border-black/10"
                      )}
                    >
                      <AvatarFallback className="flex w-full items-center justify-center dark:bg-white/10">
                        <LandmarkIcon
                          size={22}
                          className="opacity-60"
                          aria-hidden="true"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="line-clamp-1 font-medium">{bank.bank}</h2>
                      <p className="text-muted-foreground text-sm">
                        {bank.bank_code}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{bank?.bank_number}</TableCell>
                <TableCell>{bank?.bank_type}</TableCell>
                <TableCell>{bank?.bank_holder}</TableCell>

                {/* <TableCell>
                  {formatCurrency(bank?.maximum_bank_balance)}
                </TableCell> */}
                <TableCell>
                  <span className="mr-1">{currencySymbol}</span>
                  {formatCurrency(bank?.total_balance)}
                </TableCell>
                <TableCell>
                  <span className="mr-1">{currencySymbol}</span>
                  {formatCurrency(bank?.daily_limit)}
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="gap-1 rounded-md">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        bank.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-destructive"
                      )}
                      aria-hidden="true"
                    ></span>
                    {bank.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <BankActionButtons bank={bank} view="table" />
                </TableCell>
                <TableCell>
                  <BankThreeDotsDropdown bank={bank} />
                </TableCell>
              </TableRow>
            );
          })}

          {filteredBanks.length === 0 && (
            <TableRow>
              <TableCell colSpan={10}>No banks found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BankDetailsTableView;
