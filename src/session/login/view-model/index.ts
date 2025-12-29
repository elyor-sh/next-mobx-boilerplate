import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";

import { GlobalsContextType } from "@/providers/global/config";
import { loginSchema } from "@/session/login/api";
import { createEffect } from "@/shared/lib/create-effect";
import { ViewModelConstructor } from "@/shared/lib/create-use-store";
import { createForm, createFormState } from "@/shared/lib/form-builder";
import { makeViewModel } from "@/shared/lib/make-view-model";

export class LoginVM implements ViewModelConstructor<GlobalsContextType> {
  form = createForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  private state = createFormState(this, this.form.control);

  constructor(public context: GlobalsContextType) {
    makeViewModel(this);
  }

  get formState() {
    return this.state.formState;
  }

  login = createEffect(async () => {
    const fields = this.form.getValues();
    const result = await signIn("credentials", {
      email: fields.email,
      password: fields.password,
      redirect: false,
    });

    if (result?.error) {
      alert(result.error);
      return;
    }

    await getSession();

    this.context.appRouter.replace("/");
  });
}
