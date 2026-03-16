import { PageHeading } from "@/components/shared/PageHeading";
import TestScenarioImportForm from "../../components/test-scenario-import/TestScenarioImportForm";

const TestScenarioImportPage = () => {
  return (
    <>
      <title>Test Scenario Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Import Test Scenarios" />
        
        <div className="mt-6">
          <TestScenarioImportForm />
        </div>
      </main>
    </>
  );
};

export default TestScenarioImportPage;