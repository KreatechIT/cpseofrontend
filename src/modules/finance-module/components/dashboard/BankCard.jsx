import { BankCardIcon, BankCodeIcon } from "@/components/icons/FinanceIcons";

export default function BankCard() {
  return (
    <div className="w-full rounded-2xl bg-[#dcdcdc]/10 dark:bg-[#ffffff]/10 shadow-none border relative overflow-hidden py-6 p-5 pb-4 max-w-100">
      <div className="flex justify-between gap-2">
        <div className="flex gap-2 items-center">
          <BankCardIcon />
          <p className="text-2xl font-medium text-primary-accent line-clamp-1"></p>
        </div>

        <div className="flex gap-2 items-center shrink-0">
          <BankCodeIcon />
        </div>
      </div>

      {/* Name and Number */}
      <div className="flex justify-between items-center font-medium mt-6 text-2xl text-primary-accent">
        <p>Andrew Forbist</p>
      </div>

      {/* Balance and Other Info */}
      <div className="mt-6 flex justify-between items-center gap-2">
        <div>
          <p className="text-xs">Balance Amount</p>
          <p className="text-2xl font-bold">$ 562,000</p>
        </div>

        <div className="flex gap-4">
          <div>
            <p className="text-xs">EXP</p>
            <p className=" font-medium text-sm">11/29</p>
          </div>
          <div>
            <p className="text-xs">CVV</p>
            <p className=" font-medium text-sm">323</p>
          </div>
        </div>
      </div>
    </div>
  );
}
