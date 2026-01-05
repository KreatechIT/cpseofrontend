import { useNavigate } from "react-router-dom";
import {
  setDialogData,
  toggleSeachDialogOpen,
} from "@/store/reducers/dialogSlice";
import { hasFinanceProduct, hasHrProduct } from "@/utils/hasPermission";
import usePermission from "@/hooks/usePermission";
import { useDispatch, useSelector } from "react-redux";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { PlusIcon } from "lucide-react";

export const MemberGlobalSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organisation } = useSelector((state) => state.organisation);
  const { hasPermission, hasAnyPermission } = usePermission();

  return (
    <>
      <CommandGroup>
        <CommandItem
          onSelect={() => {
            navigate("/organisation/dashboard");
            dispatch(toggleSeachDialogOpen(false));
          }}
        >
          <span>Organisation Dashboard</span>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />
      <CommandGroup
        heading={
          hasAnyPermission(["member.read", "member.add"]) ? "Members" : ""
        }
      >
        {hasPermission("member.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/organisation/members");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Members</span>
          </CommandItem>
        )}
        {hasPermission("member.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addMember",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Member</span>
            <PlusIcon />
          </CommandItem>
        )}
      </CommandGroup>

      <CommandSeparator />
      <CommandGroup
        heading={hasAnyPermission(["role.read", "role.add"]) ? "Roles" : ""}
      >
        {hasPermission("role.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/organisation/members/roles");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Roles</span>
          </CommandItem>
        )}
        {hasPermission("role.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addMemberRole",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Role</span>
            <PlusIcon />
          </CommandItem>
        )}
      </CommandGroup>

      <CommandGroup
        heading={
          hasAnyPermission(["company.read", "company.add"]) ? "Companies" : ""
        }
      >
        {hasPermission("company.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/organisation/company");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Companies</span>
          </CommandItem>
        )}
        {hasPermission("company.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addCompany",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Company</span>
            <PlusIcon />
          </CommandItem>
        )}
      </CommandGroup>

      <CommandGroup
        heading={
          hasAnyPermission(["department.read", "department.add"])
            ? "Departments"
            : ""
        }
      >
        {hasPermission("department.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/organisation/department");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Departments</span>
          </CommandItem>
        )}
        {hasPermission("department.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addDepartment",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Department</span>
            <PlusIcon />
          </CommandItem>
        )}
        {hasPermission("department.read") && (
          <CommandItem
            onSelect={() => {
              navigate("/organisation/department/sub-department");
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>View Sub Departments</span>
          </CommandItem>
        )}
        {hasPermission("department.add") && (
          <CommandItem
            className="flex justify-between"
            onSelect={() => {
              dispatch(
                setDialogData({
                  type: "addSubDepartment",
                  styles: "md:min-w-[800px]",
                })
              );
              dispatch(toggleSeachDialogOpen(false));
            }}
          >
            <span>Add Sub Department</span>
            <PlusIcon />
          </CommandItem>
        )}
      </CommandGroup>

      {hasFinanceProduct(organisation?.products) && (
        <>
          {" "}
          <CommandGroup heading="Finance">
            <CommandItem
              onSelect={() => {
                navigate("/finance/dashboard");
                dispatch(toggleSeachDialogOpen(false));
              }}
            >
              <span>Finance Dashboard</span>
            </CommandItem>
            {hasPermission("finance_report.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/profit-loss/pl-statement");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Profit & Loss Statement</span>
              </CommandItem>
            )}
          </CommandGroup>
          <CommandGroup
            heading={
              hasAnyPermission([
                "finance_claim.read",
                "finance_transaction.read",
                "finance_revenue.read",
              ])
                ? "Transactions"
                : ""
            }
          >
            {hasPermission("finance_claim.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/transaction/claims");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Claims</span>
              </CommandItem>
            )}
            {hasPermission("finance_claim.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addEmployeeClaim",
                      styles: "md:min-w-[800px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Claim</span>
                <PlusIcon />
              </CommandItem>
            )}
            {hasPermission("finance_transaction.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/transaction/details");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Transaction Details</span>
              </CommandItem>
            )}
            {hasPermission("finance_transaction.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addCreditTransaction",
                      styles: "md:min-w-[800px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add Credit Transaction</span>
                <PlusIcon />
              </CommandItem>
            )}
            {hasPermission("finance_transaction.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addDebitTransaction",
                      styles: "md:min-w-[800px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add Debit Transaction</span>
                <PlusIcon />
              </CommandItem>
            )}

            {hasPermission("finance_revenue.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/transaction/wallet-activity");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Wallet Activity</span>
              </CommandItem>
            )}
            {hasPermission("finance_revenue.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addWalletActivity",
                      styles: "md:min-w-[800px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Wallet Activity</span>
                <PlusIcon />
              </CommandItem>
            )}
          </CommandGroup>
          {/* Banks */}
          <CommandGroup
            heading={hasAnyPermission(["finance_bank.read"]) ? "Banks" : ""}
          >
            {hasPermission("finance_bank.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/bank/details");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Banks</span>
              </CommandItem>
            )}
            {hasPermission("finance_bank.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addNewBank",
                      styles: "md:min-w-[800px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Bank</span>
                <PlusIcon />
              </CommandItem>
            )}

            {hasPermission("finance_bank.read") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "bankTransfer",
                      styles: "md:min-w-[800px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Bank Transfer</span>
                <PlusIcon />
              </CommandItem>
            )}
            {hasPermission("finance_bank.read") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "bankWithdrawDeposit",
                      styles: "md:min-w-[800px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Bank Deposit/Withdraw</span>
                <PlusIcon />
              </CommandItem>
            )}
            {hasPermission("finance_bank.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/bank/transactions");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Bank Transactions</span>
              </CommandItem>
            )}
            {hasPermission("finance_bank.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/bank/settings");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Bank Transaction Descriptions</span>
              </CommandItem>
            )}
            {hasPermission("finance_bank.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addTransactionDescription",
                      styles: "md:min-w-[700px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Bank Transaction Description</span>
                <PlusIcon />
              </CommandItem>
            )}
          </CommandGroup>
          {/* Budgets */}
          <CommandGroup
            heading={hasAnyPermission(["finance_budget.read"]) ? "Budgets" : ""}
          >
            {hasPermission("finance_budget.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/budget/summary");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Budget Summary</span>
              </CommandItem>
            )}
            {hasPermission("finance_budget.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/budget/report");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Budget Report</span>
              </CommandItem>
            )}
            {hasPermission("finance_budget.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/budget/details");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Budget Details</span>
              </CommandItem>
            )}

            {hasPermission("finance_budget.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addBudget",
                      styles: "md:min-w-[800px] lg:min-w-[900px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Budget</span>
                <PlusIcon />
              </CommandItem>
            )}
          </CommandGroup>
          {/* Finance Categories */}
          <CommandGroup
            heading={
              hasAnyPermission(["finance_category.read"])
                ? "Expense Categories"
                : ""
            }
          >
            {hasPermission("finance_category.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/expenses/category");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Expenses Categories</span>
              </CommandItem>
            )}

            {hasPermission("finance_category.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addExpenseCategory",
                      styles: "md:min-w-[700px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add Expense Category</span>
                <PlusIcon />
              </CommandItem>
            )}
            {hasPermission("finance_category.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/expenses/sub-category");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Expenses Sub Categories</span>
              </CommandItem>
            )}

            {hasPermission("finance_category.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addExpenseSubCategory",
                      styles: "md:min-w-[700px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add Expense Sub Category</span>
                <PlusIcon />
              </CommandItem>
            )}

            {hasPermission("finance_category.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/finance/expenses/sub-sub-category");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Expenses Sub Sub Categories</span>
              </CommandItem>
            )}

            {hasPermission("finance_category.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addExpenseSubSubCategory",
                      styles: "md:min-w-[700px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add Expense Sub Sub Category</span>
                <PlusIcon />
              </CommandItem>
            )}
          </CommandGroup>
        </>
      )}

      {hasHrProduct(organisation?.products) && (
        <>
          <CommandGroup heading="HR Management">
            <CommandItem
              onSelect={() => {
                navigate("/hr/hr-management/dashboard?from=uam");
                dispatch(toggleSeachDialogOpen(false));
              }}
            >
              <span>HR Management Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate("/hr/hiring-management/dashboard?from=hr");
                dispatch(toggleSeachDialogOpen(false));
              }}
            >
              <span>Hiring Mangemnet Dashboard</span>
            </CommandItem>

            {hasPermission("hr_hiring_vacancy.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/hr/hiring-management/vacancy");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Hiring Vacancies</span>
              </CommandItem>
            )}
            {hasPermission("hr_hiring_vacancy.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addVacancy",
                      styles: "md:min-w-[800px] lg:min-w-[900px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Hiring Vacancy</span>
                <PlusIcon />
              </CommandItem>
            )}
          </CommandGroup>

          {/* Job Posting */}
          <CommandGroup
            heading={
              hasAnyPermission(["hr_job_posting.read"]) ? "Recruitment" : ""
            }
          >
            {hasPermission("hr_job_posting.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/hr/hiring-management/recruitment/jobs");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View All Job Posts</span>
              </CommandItem>
            )}

            {hasPermission("hr_job_posting.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addNewJobPosting",
                      styles: "md:min-w-[800px] lg:min-w-[900px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Job Posting</span>
                <PlusIcon />
              </CommandItem>
            )}
            {hasPermission("hr_job_candidate.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/hr/hiring-management/recruitment/candidates");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View All Candidates</span>
              </CommandItem>
            )}
            {hasPermission("hr_referral.read") && (
              <CommandItem
                onSelect={() => {
                  navigate("/hr/hiring-management/recruitment/referrals");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View All Referrals</span>
              </CommandItem>
            )}

            {hasPermission("hr_referral.add") && (
              <CommandItem
                className="flex justify-between"
                onSelect={() => {
                  dispatch(
                    setDialogData({
                      type: "addNewReferral",
                      styles: "md:min-w-[800px] lg:min-w-[900px]",
                    })
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>Add New Referral</span>
                <PlusIcon />
              </CommandItem>
            )}
          </CommandGroup>

          {/* Talent Pool */}
          <CommandGroup
            heading={
              hasAnyPermission([
                "hr_talent_pool.read_whitelist",
                "hr_talent_pool.read_blacklist",
              ])
                ? "Talent Pool"
                : ""
            }
          >
            {hasPermission("hr_talent_pool.read_whitelist") && (
              <CommandItem
                onSelect={() => {
                  navigate("/hr/hiring-management/talent-pool/whitelist");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Whitelist Candidates</span>
              </CommandItem>
            )}
            {hasPermission("hr_talent_pool.read_blacklist") && (
              <CommandItem
                onSelect={() => {
                  navigate("/hr/hiring-management/talent-pool/blacklist");
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>View Blacklist Candidates</span>
              </CommandItem>
            )}
          </CommandGroup>

          {/* Personality Test */}
          <CommandGroup
            heading={
              hasAnyPermission([
                "hr_disc_questions.read",
                "hr_disc_questions.add",
              ])
                ? "Personality Test"
                : ""
            }
          >
            {hasPermission("hr_disc_questions.read") && (
              <CommandItem
                onSelect={() => {
                  navigate(
                    "/hr/hiring-management/personality-test-settings/disc-settings"
                  );
                  dispatch(toggleSeachDialogOpen(false));
                }}
              >
                <span>DISC Settings</span>
              </CommandItem>
            )}
          </CommandGroup>
        </>
      )}
    </>
  );
};
