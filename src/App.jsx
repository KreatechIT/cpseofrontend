import { lazy, Suspense } from "react";

import routes from "./routes/index.jsx";
import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/themes/ThemeProvider";

const GlobalSheet = lazy(() => import("@/components/shared/GlobalSheet"));
const GlobalDialog = lazy(() => import("@/components/shared/GlobalDialog"));

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={routes} />

      {/* Global Toaster */}
      <Toaster position="top-center" />

      {/* Global Dialog */}
      <Suspense fallback={null}>
        <GlobalDialog />
      </Suspense>

      {/* Global Sheet */}
      <Suspense fallback={null}>
        <GlobalSheet />
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
