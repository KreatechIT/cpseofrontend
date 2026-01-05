import usePermission from "@/hooks/usePermission";
import { getAllBanks } from "@/modules/finance-module/services/bankService";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Custom hook to manage bank data and user-specific access.
 * Fetches banks from API if not already in Redux state.
 * Provides methods to get banks based on user permissions.
 */
const useBanks = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { banks } = useSelector((state) => state.banks);

  // Fetch all banks if not already loaded in Redux
  useEffect(() => {
    if (!banks) getAllBanks(user.organisation_id, dispatch);
  }, []);

  /**
   * Get all banks the user has access to.
   * - Users with "finance_bank.assign" permission get all banks.
   * - Others get only banks where they are a member.
   */
  const getMyBanks = () => {
    if (hasPermission("finance_bank.assign")) {
      return banks;
    }

    return banks?.filter((bank) =>
      bank.members.some((member) => member.id === user.id)
    );
  };

  /**
   * Get all active and visible banks the user has access to.
   * - Filters banks with status "Active" and display = true.
   * - Users with "finance_bank.assign" permission get all filtered banks.
   * - Others get only filtered banks where they are a member.
   */
  const getMyActiveBanks = () => {
    let filteredBanks = banks?.filter(
      (bank) => bank && bank.status === "Active" && bank.display
    );

    if (hasPermission("finance_bank.assign")) {
      return filteredBanks;
    }

    return filteredBanks?.filter((bank) =>
      bank.members.some((member) => member.id === user.id)
    );
  };

  return {
    getMyBanks,
    getMyActiveBanks,
  };
};

export default useBanks;
