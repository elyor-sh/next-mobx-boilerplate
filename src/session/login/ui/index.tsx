"use client";

import { observer } from "mobx-react-lite";

import { useGlobalsContext } from "@/providers/global/config";
import { LoginVM } from "@/session/login/view-model";

export const Login = observer(() => {
  const { vm } = useGlobalsContext(LoginVM);

  return (
    <form
      className="max-w-[400px] w-full mx-auto"
      onSubmit={vm.form.handleSubmit(vm.login)}
    >
      <h1 className="text-2xl font-bold mb-3 text-center">Sign in</h1>
      <label className="block">
        <p>Email</p>
        <input
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Email"
          type="email"
          {...vm.form.register("email")}
        />
      </label>
      {vm.formState.errors.email && (
        <p className="text-red-500 text-sm">
          {vm.formState.errors.email.message}
        </p>
      )}
      <label className="block mt-3">
        <p>Password</p>
        <input
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Password"
          type="password"
          {...vm.form.register("password")}
        />
      </label>
      {vm.formState.errors.password && (
        <p className="text-red-500 text-sm">
          {vm.formState.errors.password.message}
        </p>
      )}
      <button
        disabled={vm.login.state.loading || vm.formState.isSubmitting}
        className="block mt-5 w-full bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50"
        type="submit"
      >
        Login
      </button>
    </form>
  );
});

Login.displayName = "Login";
