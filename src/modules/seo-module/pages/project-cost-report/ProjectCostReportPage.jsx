import { PageHeading } from "@/components/shared/PageHeading";
import ProjectCostOverview from "../../components/project-cost-report/ProjectCostOverview";

const ProjectCostReportPage = () => {
  return (
    <>
      <title>Project Cost Report - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Project Cost Report" />
        <ProjectCostOverview />
      </main>
    </>
  );
};

export default ProjectCostReportPage;