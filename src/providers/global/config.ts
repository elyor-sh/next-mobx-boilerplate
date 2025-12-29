import { isEqual } from "lodash-es";
import { observable, runInAction } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

import { Session } from "@/providers/auth/config";
import { UserSession } from "@/shared/lib/auth";
import { createUseStore } from "@/shared/lib/create-use-store";
import { AppRouter, useInitRouter } from "@/shared/lib/use-init-router";

enableStaticRendering(typeof window === "undefined");

export class Globals {
  appRouter: AppRouter;
  session: Session;

  constructor(appRouter: AppRouter, session: Session) {
    this.appRouter = appRouter;
    this.session = session;
  }
}

export const GlobalsContext = createContext<Globals | undefined>(undefined);

export type GlobalsContextType = Globals;

export const useGlobalsContext = createUseStore(GlobalsContext);

export const useInitGlobals = () => {
  const { data: session } = useSession();
  const appRouter = useInitRouter();
  const [sessionStore] = useState(
    () => new Session(session?.user as UserSession | null),
  );
  const [globals] = useState(() => new Globals(appRouter, sessionStore));

  useEffect(() => {
    runInAction(() => {
      if (isEqual(sessionStore.user, session?.user)) return;
      sessionStore.user = session
        ? observable(session.user as UserSession)
        : null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return globals;
};
