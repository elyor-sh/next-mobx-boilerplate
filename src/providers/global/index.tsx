"use client";

import {useInitRouter} from "@/shared/lib/use-init-router";
import {Globals, GlobalsContext} from "@/providers/global/config";
import {ReactNode, useState} from "react";

type Props = {
  children: ReactNode;
}

export const GlobalProvider = ({children}: Props) => {
  const appRouter = useInitRouter()
  const [globals] = useState(() => new Globals(appRouter));

  return (
    <GlobalsContext value={globals}>
      {children}
    </GlobalsContext>
  );
}