"use client";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Workspace } from "../core/types";
import { getWorkspaceById, getWorkspaces, getStoredWorkspaceId, setStoredWorkspaceId } from "../core/workspaces";
import { ToastProvider } from "./Toast";

interface ShellContextValue {
  workspace: Workspace;
  setWorkspaceById: (id: Workspace["id"]) => void;
}

export const ShellContext = createContext<ShellContextValue | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace>(getWorkspaces()[0]);

  useEffect(() => {
    const id = getStoredWorkspaceId();
    setWorkspaceById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => undefined);
    }
  }, []);

  const setWorkspaceById = (id: Workspace["id"]) => {
    const ws = getWorkspaceById(id);
    setWorkspace(ws);
    setStoredWorkspaceId(id);
    if (typeof document !== "undefined") {
      document.body.classList.remove("workspace-personal", "workspace-creator", "workspace-business");
      document.body.classList.add(`workspace-${id}`);
    }
  };

  return (
    <ShellContext.Provider value={{ workspace, setWorkspaceById }}>
      <ToastProvider>{children}</ToastProvider>
    </ShellContext.Provider>
  );
}

export function useWorkspaceContext() {
  const ctx = React.useContext(ShellContext);
  if (!ctx) throw new Error("ShellProvider missing");
  return ctx;
}
