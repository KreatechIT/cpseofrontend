import { PageHeading } from "@/components/shared/PageHeading";
import TestScenario from "../../components/test-scenario/TestScenario";

const TestScenarioPage = () => {
  return (
    <>
      <title>Test Scenario - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Test Scenario" />
        <TestScenario />
      </main>
    </>
  );
};

export default TestScenarioPage;
