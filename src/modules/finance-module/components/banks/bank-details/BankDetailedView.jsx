import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

import { LandmarkIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatCurrency";
import { MemberNameAndEmail } from "@/modules/member-module/components/members/MemberBlocks";

const BankDetailedView = () => {
  const { props: bankInfo } = useSelector((state) => state.dialog);
  const { currencyTypes } = useSelector((state) => state.banks);

  if (!bankInfo) {
    return (
      <p className="text-muted-foreground text-center">
        No bank data available.
      </p>
    );
  }

  const currencySymbol = currencyTypes?.find(
    (currency) => currency?.string === bankInfo?.bank_currency
  ).symbol;

  return (
    <section className="p-1">
      <div className="-mt-4 mb-4 text-center">
        <h2 className="text-2xl font-semibold">Bank Details</h2>
      </div>

      <Card className="dark:bg-card bg-white shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 rounded-full border border-black/10">
                <AvatarFallback className="flex w-full items-center justify-center dark:bg-white/10">
                  <LandmarkIcon
                    size={22}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                </AvatarFallback>
              </Avatar>
              {bankInfo.bank || "Unnamed Bank"}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1 rounded-md">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    bankInfo.status === "Active"
                      ? "bg-emerald-500"
                      : "bg-destructive"
                  )}
                  aria-hidden="true"
                ></span>
                {bankInfo.status}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Bank Number</span>
              <p>{bankInfo.bank_number || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bank Code</span>
              <p>{bankInfo.bank_code || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bank Type</span>
              <p>{bankInfo.bank_type || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bank Holder</span>
              <p>{bankInfo.bank_holder || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Currency</span>
              <p>{bankInfo.bank_currency || "N/A"}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Display</span>
              <p>{bankInfo.display ? "Yes" : "No"}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Maximum Balance</span>
              <p>
                <span className="mr-1">{currencySymbol}</span>
                {formatCurrency(bankInfo.maximum_bank_balance)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Current Balance</span>
              <p>
                <span className="mr-1">{currencySymbol}</span>
                {formatCurrency(bankInfo.total_balance)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Daily Limit</span>
              <p>
                <span className="mr-1">{currencySymbol}</span>
                {formatCurrency(bankInfo.daily_limit)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="mb-2 text-lg font-medium">Members with Access</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bankInfo.members?.map((member) => (
            <Card
              className="dark:bg-card overflow-hidden rounded-xl bg-white py-2 shadow-none"
              key={member.id}
            >
              <CardContent className="px-4 text-sm">
                <MemberNameAndEmail member={member} view="table" />
              </CardContent>
            </Card>
          )) || (
            <p className="text-muted-foreground text-sm">No members found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BankDetailedView;
