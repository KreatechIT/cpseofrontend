import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeading } from "@/components/shared/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton";
import SearchConsoleImportFilters from "../../components/search-console-import/SearchConsoleImportForm";

const SearchConsoleImportPage = () => {
  const { analytics } = useSelector((state) => state.searchConsoleImport);
  const loading = !analytics;


  return (
    <>
      <title>Search Console Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Search Console Import" />

          <SearchConsoleImportFilters />
      </main>
    </>
  );
};

export default SearchConsoleImportPage;