import { Formik } from "formik";
import { toast } from "sonner";
import { adminLogin, memberLogin } from "../services/authService";
import { setAccessToken, setRefreshToken } from "@/utils/tokenHelper";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setAuthData } from "@/modules/auth-module/store/authSlice";
import InputField from "@/components/form-fields/InputField";
import PasswordField from "@/components/form-fields/PasswordField";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { loginValidationSchema } from "../validations/authValidationSchema";

const LoginForm = ({ userType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };

  const handleLogin = async (values, { setSubmitting }) => {
    const formData = { ...values };

    try {
      const login = userType === "admin" ? adminLogin : memberLogin;
      const res = await login(formData);

      const { access, refresh, ...user } = res.data;

      setAccessToken(access);
      setRefreshToken(refresh);

      dispatch(setAuthData(user));

      toast(`Welcome back ${user?.first_name} ${user?.last_name}.`);

      navigate("/");
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={handleLogin}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="my-1 space-y-4">
          <InputField
            fieldName="email"
            label="email"
            value={values.email}
            error={errors.email}
            touched={touched.email}
            handleChange={handleChange}
            placeholder="Enter your email"
          />

          <PasswordField
            fieldName="password"
            label="password"
            value={values.password}
            error={errors.password}
            touched={touched.password}
            handleChange={handleChange}
            placeholder="Enter your password"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-2  w-full rounded-md p-5 text-white shadow-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircleIcon className="scale-125 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
