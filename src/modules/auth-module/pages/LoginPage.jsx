import { isTokenExpired } from "@/utils/tokenHelper";

// Background Illustrations
import AdminLoginBg from "@/assets/images/admin-login.svg";
import MemberLoginBg from "@/assets/images/member-login.svg";

import LoginThemeToggle from "@/components/themes/LoginThemeToggle";
import { BorderTrail } from "@/components/ui/border-trail";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "../components/LoginForm";
import { Link, Navigate } from "react-router-dom";

const LoginPage = ({ userType }) => {
  // Redirects to homepage if already logged in.
  if (!isTokenExpired()) {
    return <Navigate to="/" />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <title>
        {userType === "admin" ? "Admin " : "Member "} Login - Core360
      </title>

      {/* Background Image */}
      <div className="absolute top-0 h-full w-full">
        <img
          src={userType === "admin" ? AdminLoginBg : MemberLoginBg}
          alt="background image"
          className="h-full w-full animate-pulse object-cover"
        />
      </div>

      <LoginThemeToggle />

      {/* Login Card */}
      <Card className="relative w-[95%] overflow-hidden bg-white py-12 shadow-xl sm:w-[30rem] sm:px-8 dark:border-white/15 dark:bg-[#1B1B1B]">
        <BorderTrail
          className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
          size={200}
        />

        <CardHeader>
          <TextShimmer
            className="mb-6 text-center text-xl font-semibold"
            duration={3}
          >
            CorePath360
          </TextShimmer>

          <CardTitle className="-mt-2 text-center text-2xl font-semibold sm:text-3xl">
            {userType === "admin" ? "Admin Login" : "Member Login"}
          </CardTitle>

          <CardDescription className="text-foreground/90 text-center font-light">
            Welcome back! Please enter your credentials.
          </CardDescription>
        </CardHeader>

        {/* Login Form */}
        <CardContent className="mt-2">
          <LoginForm key={userType} userType={userType} />
        </CardContent>

        <CardFooter>
          <p className="w-full text-center text-sm font-light">
            Are you {userType === "admin" ? "a member" : "an admin"}?{" "}
            <Link
              to={userType === "admin" ? "/login" : "/admin-login"}
              className="decoration-primary underline underline-offset-3"
            >
              Login
            </Link>{" "}
            here.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginPage;
