import adminDialogRegistryItems from "@/modules/admin-module/lib/adminDialogRegistryItems";
import financeDialogRegistryItems from "@/modules/finance-module/lib/financeDialogRegistryItems";
import hrDialogRegistryItems from "@/modules/hr-module/lib/hrDialogRegistryItems";
import memberDialogRegistryItems from "@/modules/member-module/lib/memberDialogRegistryItems";
import seoDialogRegistryItems from "@/modules/seo-module/lib/seoDialogRegistryItems";

const dialogRegistry = {
  ...adminDialogRegistryItems,
  ...memberDialogRegistryItems,
  ...financeDialogRegistryItems,
  ...hrDialogRegistryItems,
  ...seoDialogRegistryItems,
};

export default dialogRegistry;
