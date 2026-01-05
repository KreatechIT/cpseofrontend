import { getMemberTaskChecklist } from "@/modules/hr-module/services/onboardingTaskChecklistService";
import { getOrganisation } from "@/modules/member-module/services/organisationService";
import { hasHrProduct } from "@/utils/hasPermission";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import CreateTaskChecklist from "../../components/onboarding-task-checklist/CreateTaskChecklist";

const CreateOnboardingTaskChecklist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { organisation } = useSelector((state) => state.organisation);
  const { checklist } = useSelector((state) => state.onboardingTaskChecklist);

  useEffect(() => {
    if (!organisation) getOrganisation(user?.organisation_id, dispatch);
  }, []);

  useEffect(() => {
    if (!checklist && user?.id)
      getMemberTaskChecklist(user?.organisation_id, user?.id, dispatch);

    if (checklist && checklist.member_id !== user.id)
      getMemberTaskChecklist(user?.organisation_id, user?.id, dispatch);
  }, [user]);

  if (!organisation || !checklist) {
    return null;
  }

  // Onboarding process only when HR module is available.
  if (hasHrProduct(organisation?.products)) {
    if (checklist.id) {
      return <Outlet />;
    } else {
      return (
        <div className="max-w-6xl mx-auto py-10">
          <CreateTaskChecklist
            organisation_id={user.organisation_id}
            member_id={user.id}
            dispatch={dispatch}
            full_name={user.first_name + " " + user.last_name}
          />
        </div>
      );
    }
  } else {
    return <Outlet />;
  }
};

export default CreateOnboardingTaskChecklist;
