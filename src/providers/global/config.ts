import {AppRouter} from "@/shared/lib/use-init-router";
import {createContext} from "react";
import {createUseStore} from "@/shared/lib/create-use-store";
import {enableStaticRendering} from "mobx-react-lite";

enableStaticRendering(typeof window === "undefined");

export class Globals {
  appRouter: AppRouter;

  constructor(appRouter: AppRouter) {
    this.appRouter = appRouter;
  }

}

export const GlobalsContext = createContext<Globals | undefined>(undefined)

export type GlobalsContextType = Globals

export const useGlobalsContext = createUseStore(GlobalsContext)