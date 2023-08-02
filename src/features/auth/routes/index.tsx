import React from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { PublicRoute } from "../components";

import { Spinner } from "@/components/ui";

const Login = React.lazy(() => import("./login"));

const RoutesWrapper: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full min-h-full w-full flex-col justify-center bg-neutral-50">
      <main className="flex items-center justify-center px-5">
        <PublicRoute>
          <React.Suspense
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white text-typography-primary">
                <Spinner />
                <p className="font-medium">{t("common:loading")}</p>
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </PublicRoute>
      </main>
    </div>
  );
};

export const routes: RouteObject[] = [
  {
    element: <RoutesWrapper />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <Navigate to="login" replace />,
      },
    ],
  },
];
