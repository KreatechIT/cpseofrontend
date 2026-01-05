import { BankCardIcon, BankCodeIcon } from "@/components/icons/FinanceIcons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BankThreeDotsDropdown } from "./BankDetailsBlocks";
import { useDispatch, useSelector } from "react-redux";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";

export default function BankDetailsCardView({ filteredBanks }) {
  return (
    <div className="@9xl:grid-cols-4 grid grid-cols-1 gap-4 @4xl:grid-cols-2 @7xl:grid-cols-3">
      {filteredBanks.map((bank) => (
        <BankCard key={bank.id} bank={bank} />
      ))}

      {filteredBanks.length === 0 && <p>No banks found</p>}
    </div>
  );
}

const BankCard = function ({ bank }) {
  const dispatch = useDispatch();
  const { currencyTypes } = useSelector((state) => state.banks);

  const currencySymbol = currencyTypes?.find(
    (currency) => currency?.string === bank?.bank_currency
  ).symbol;

  return (
    <Card className="dark:bg-card relative w-full overflow-hidden rounded-2xl bg-black/[2%] shadow-none">
      <CardHeader className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <BankCardIcon />
          <p className="text-primary dark:text-primary/90 line-clamp-1 text-2xl font-medium">
            {bank?.bank}
          </p>
        </div>

        <div className="flex shrink-0 gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <p className="text-lgg font-medium">{bank?.bank_code}</p>
            <BankCodeIcon />
          </div>
          <div className="">
            <BankThreeDotsDropdown bank={bank} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-4">
        {/* Name and Number */}
        <div className="flex items-center justify-between font-medium">
          <p>{bank?.bank_holder}</p>
          <p className="text-primary-accent text-sm">{bank?.bank_number}</p>
        </div>

        <div className="mt-4 flex h-7 items-center gap-6">
          <>
            <div className="ml-auto">
              <Button
                className="border-primary/75 dark:border-primary/75 bg-transaprent w-full gap-3 rounded-lg"
                variant="outline"
                onClick={() =>
                  dispatch(
                    setDialogData({
                      type: "bankWithdrawDeposit",
                      props: bank,
                      styles: "md:min-w-[750px] xl:min-w-[800px]",
                    })
                  )
                }
                disabled={bank.status === "Inactive"}
              >
                Deposit/Withdraw
              </Button>
            </div>
          </>
        </div>

        {/* Balance and Other Info */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <div className="-mt-6">
            <p className="text-xs">Balance Amount</p>
            <p className="text-2xl font-bold">
              <span className="text-sm mr-1 text-foreground/85">
                {currencySymbol}
              </span>
              {formatCurrency(bank?.total_balance)}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {bank?.bank_currency}
            </p>
          </div>

          <div className="flex gap-4">
            <div>
              <p className="text-xs">Status</p>
              {bank.status === "Active" ? (
                <p className="text-emerald-700 text-sm font-semibold">Active</p>
              ) : (
                <p className="text-destructive text-sm font-medium">Inactive</p>
              )}
            </div>

            <div>
              <Button
                className="mt-0.5 w-full gap-3 rounded-lg"
                size="sm"
                onClick={() =>
                  dispatch(
                    setDialogData({
                      type: "bankTransfer",
                      props: bank,
                      styles: "md:min-w-[750px] xl:min-w-[800px]",
                    })
                  )
                }
                disabled={bank.status === "Inactive"}
              >
                Transfer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
