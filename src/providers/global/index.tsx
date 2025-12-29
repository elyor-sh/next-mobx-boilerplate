"use client";

import { ReactNode } from "react";

import { GlobalsContext, useInitGlobals } from "@/providers/global/config";

type Props = {
  children: ReactNode;
};

export const GlobalProvider = ({ children }: Props) => {
  const globals = useInitGlobals();

  return <GlobalsContext value={globals}>{children}</GlobalsContext>;
};
