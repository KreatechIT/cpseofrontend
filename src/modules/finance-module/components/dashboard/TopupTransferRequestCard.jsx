import { Card, CardContent } from "@/components/ui/card";
import {
  BalanceRequestIcon,
  BalanceTransferIcon,
  TopUpIcon,
} from "@/components/icons/FinanceIcons";
import { History } from "lucide-react";
import { Link } from "react-router-dom";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { useDispatch } from "react-redux";

export default function TopupTransferRequestCard() {
  const dispatch = useDispatch();
  return (
    <Card className="shadow-none bg-card">
      <CardContent className="flex justify-between">
        <div
          className="flex flex-col items-center"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "bankWithdrawDeposit",
                styles: "md:min-w-[750px] xl:min-w-[800px]",
              })
            )
          }
        >
          <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center ">
            <TopUpIcon />
          </div>
          <p className="text-sm  mt-1">Top Up</p>
        </div>

        <div
          className="flex flex-col items-center"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "bankTransfer",
                styles: "md:min-w-[750px] xl:min-w-[800px]",
              })
            )
          }
        >
          <div className="size-10 bg-primary/20  rounded-lg flex justify-center items-center ">
            <BalanceTransferIcon />
          </div>
          <p className="text-sm  mt-1">Transfer</p>
        </div>

        <div
          className="flex flex-col items-center"
          onClick={() => {
            dispatch(
              setDialogData({
                type: "addWalletActivity",
                styles: "md:min-w-[750px] lg:min-w-[850px]",
              })
            );
          }}
        >
          <div className="size-10 bg-primary/20  rounded-lg flex justify-center items-center ">
            <BalanceRequestIcon />
          </div>
          <p className="text-sm  mt-1">Request</p>
        </div>

        <Link to="/finance/transaction/details">
          <div className="flex flex-col items-center">
            <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center ">
              <History className="stroke-primary" />
            </div>
            <p className="text-sm mt-1">History</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
