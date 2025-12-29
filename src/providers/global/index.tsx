"use client";

import {GlobalsContext, useInitGlobals} from "@/providers/global/config";
import {ReactNode} from "react";

type Props = {
  children: ReactNode;
}

export const GlobalProvider = ({children}: Props) => {
  const globals = useInitGlobals()

  return (
    <GlobalsContext value={globals}>
      {children}
    </GlobalsContext>
  );
}