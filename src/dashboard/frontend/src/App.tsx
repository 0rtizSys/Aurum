import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Maintenance } from "./pages/Maintenance";
import { UserCommandTester } from "./pages/UserCommandTester";
import type { ApiState } from "./types/dashboard";

interface DashboardStatusResponse {
  inMaintenance?: boolean;
}

interface DashboardStatusState {
  apiState: ApiState;
  inMaintenance: boolean;
}

const API_BASE_URL = "http://localhost:3001";
const STATUS_ENDPOINT = `${API_BASE_URL}/api/status`;

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="steel-panel w-full max-w-md space-y-4 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-700 bg-slate-950 text-sm font-semibold uppercase tracking-[0.24em] text-white">
          AU
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
          Aurum Dashboard
        </p>
        <h1 className="text-2xl font-semibold text-white">Conectando con el panel</h1>
        <p className="text-sm leading-7 text-slate-400">
          Estamos revisando el estado de mantenimiento para decidir si mostramos el dashboard o la vista de resguardo.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  const [status, setStatus] = useState<DashboardStatusState>({
    apiState: "checking",
    inMaintenance: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardStatus() {
      try {
        const response = await fetch(STATUS_ENDPOINT, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Status endpoint failed with ${response.status}`);
        }

        const data = (await response.json()) as DashboardStatusResponse;

        setStatus({
          apiState: "online",
          inMaintenance: Boolean(data.inMaintenance),
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Dashboard status check failed:", error);
        setStatus({
          apiState: "offline",
          inMaintenance: false,
        });
      }
    }

    void loadDashboardStatus();

    return () => controller.abort();
  }, []);

  if (status.apiState === "checking") {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/maintenance"
          element={<Maintenance apiState={status.apiState} statusEndpoint={STATUS_ENDPOINT} />}
        />

        <Route
          path="/dashboard"
          element={
            status.inMaintenance ? (
              <Navigate to="/maintenance" replace />
            ) : (
              <Dashboard apiState={status.apiState} statusEndpoint={STATUS_ENDPOINT} />
            )
          }
        />

        <Route
          path="/commands"
          element={
            status.inMaintenance ? (
              <Navigate to="/maintenance" replace />
            ) : (
              <UserCommandTester />
            )
          }
        />

        <Route
          path="*"
          element={
            status.inMaintenance ? (
              <Navigate to="/maintenance" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
