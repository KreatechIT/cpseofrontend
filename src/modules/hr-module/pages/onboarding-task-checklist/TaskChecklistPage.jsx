import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMemberTaskChecklist } from "../../services/onboardingTaskChecklistService";
import { PageHeading } from "@/components/shared/PageHeading";
import { FormSkeleton } from "@/components/ui/skeleton";
import TaskChecklistDetails from "../../components/onboarding-task-checklist/TaskChecklistDetails";

const TaskChecklistPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { checklist } = useSelector((state) => state.taskChecklist);

  useEffect(() => {
    if (!checklist)
      getMemberTaskChecklist(user?.organisation_id, user.id, dispatch);
  }, []);

  return (
    <>
      <title>Task Checklist - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading withCardTableView={false}>
            <span className="text-primary text-xl">
              Welcome, {user.first_name}!
            </span>
          </PageHeading>
        </div>

        {checklist ? <TaskChecklistDetails /> : <FormSkeleton />}
      </main>
    </>
  );
};

export default TaskChecklistPage;
