import { AddMemberIcon } from "@/components/icons/Icons";
import { FormButtons } from "@/components/form-fields/FormButtons";
import MultiSelectField from "@/components/form-fields/MultiSelectField";
import { assignMemberToBank } from "@/modules/finance-module/services/bankService";
import { getAllMembers } from "@/modules/member-module/services/organisationService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const AssignMemberToBankForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { members } = useSelector((state) => state.organisation);
  const { props: bankInfo } = useSelector((state) => state.dialog);

  // Load members
  useEffect(() => {
    !members && getAllMembers(user?.organisation_id, dispatch);
  }, []);

  // Function to convert members to value/label format
  const makeMemberOptions = (members) => {
    if (!members) return [];

    const options = members.map((member) => ({
      label: `${member.first_name} ${member.last_name}`,
      value: member.id,
    }));

    return options;
  };

  // Memoize member options
  const memberOptions = useMemo(() => makeMemberOptions(members), [members]);

  const initialValues = {
    members: makeMemberOptions(bankInfo?.members),
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {};
    data.member_ids = [];

    values.members.map((member) => data.member_ids.push(member.value));

    assignMemberToBank(user?.organisation_id, bankInfo?.id, data, dispatch)
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddMemberIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="mt-2 text-center text-xl font-medium">Assign Member</h2>
      </div>

      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="my-1 space-y-4">
            <MultiSelectField
              fieldName="members"
              label="Members"
              value={values.members}
              error={errors.members}
              touched={touched.members}
              placeholder="Select members"
              options={memberOptions}
              handleChange={(selected) => setFieldValue("members", selected)}
              isRequired={false}
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AssignMemberToBankForm;
