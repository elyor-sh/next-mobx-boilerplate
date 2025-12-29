import {GlobalsContextType} from "@/providers/global/config";
import {ViewModelConstructor} from "@/shared/lib/create-use-store";
import {makeViewModel} from "@/shared/lib/make-view-model";
import {createEffect} from "@/shared/lib/create-effect";
import {signOut} from "next-auth/react";

export class LogoutVM implements ViewModelConstructor<GlobalsContextType> {
  constructor(public context: GlobalsContextType) {
    makeViewModel(this)
  }

  logout = createEffect(async () => {
    await signOut({redirect: false, callbackUrl: "/auth/login"})
    this.context.appRouter.replace("/auth/login")
    this.clearSession()
  })

  clearSession () {
    this.context.session.user = null
  }
}