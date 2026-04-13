import hrSheetRegistryItems from "@/modules/hr-module/lib/hrSheetRegistryItems";
import seoSheetRegistryItems from "@/modules/seo-module/lib/seoSheetRegistryItems";

const sheetRegistry = {
  ...hrSheetRegistryItems,
  ...seoSheetRegistryItems,
};

export default sheetRegistry;
