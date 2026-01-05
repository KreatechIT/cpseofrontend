import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import PasswordField from "@/components/form-fields/PasswordField";
import { FormButtons } from "@/components/form-fields/FormButtons";

import { closeDialog } from "@/store/reducers/dialogSlice";
import { memberResetPassword } from "../../services/organisationService";
import { memberResetPasswordSchema } from "../../validations/memberValidationSchema";

const MemberResetPasswordForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { memberId } = useSelector((state) => state.dialog.props);

  const initialValues = {
    account_password: "",
    confirm_password: "",
  };

  // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    const data = { ...values };

    memberResetPassword(user.organisation_id, memberId, data)
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <h2 className="text-center text-xl font-medium">Reset Password</h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={memberResetPasswordSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="my-1 space-y-4 gap-x-4">
            {/* New account password field */}
            <PasswordField
              fieldName="account_password"
              label="New Password"
              value={values.account_password}
              error={errors.account_password}
              touched={touched.account_password}
              handleChange={handleChange}
              placeholder="Enter new password"
              autoComplete="off"
            />

            {/* Confirm new password field */}
            <PasswordField
              fieldName="confirm_password"
              label="Confirm Password"
              value={values.confirm_password}
              error={errors.confirm_password}
              touched={touched.confirm_password}
              handleChange={handleChange}
              placeholder="Enter new password again"
              autoComplete="off"
            />

            {/* Submit and cancel buttons */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default MemberResetPasswordForm;
