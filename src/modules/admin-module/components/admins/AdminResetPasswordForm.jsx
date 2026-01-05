import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import PasswordField from "@/components/form-fields/PasswordField";
import { FormButtons } from "@/components/form-fields/FormButtons";

import { closeDialog } from "@/store/reducers/dialogSlice";
import { adminResetPassword } from "../../services/adminService";
import { adminResetPasswordSchema } from "../../validations/adminValidationSchema";

const AdminResetPasswordForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const initialValues = {
    current_password: "",
    account_password: "",
    confirm_password: "",
  };

  // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    const data = { ...values };

    adminResetPassword(user?.id, data)
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
        validationSchema={adminResetPasswordSchema}
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
            {/* Current password filed */}
            <PasswordField
              fieldName="current_password"
              label="Current Password"
              value={values.current_password}
              error={errors.current_password}
              touched={touched.current_password}
              handleChange={handleChange}
              placeholder="Enter current password"
              autoComplete="off"
            />

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

export default AdminResetPasswordForm;
