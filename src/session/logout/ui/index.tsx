"use client";

import { observer } from "mobx-react-lite";
import React from "react";

import { useGlobalsContext } from "@/providers/global/config";
import { LogoutVM } from "@/session/logout/view-model";

export const Logout = observer(() => {
  const { vm } = useGlobalsContext(LogoutVM);
  return (
    <button
      disabled={vm.logout.state.loading}
      onClick={vm.logout}
      className="block w-full bg-red-500 text-white p-2 rounded-lg disabled:opacity-50"
      aria-label="Logout"
      title="Logout"
    >
      {"--->"}
    </button>
  );
});

Logout.displayName = "Logout";
