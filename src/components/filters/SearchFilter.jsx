import { Input } from "@/components/ui/input";

export const SearchFilterInput = function ({
  searchQuery,
  setSearchQuery,
  placeholder,
}) {
  return (
    <Input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-97 rounded-lg min-w-50"
    />
  );
};
