import { getSession, signIn } from "next-auth/react";

import { Session } from "@/providers/auth/config";
import { Globals } from "@/providers/global/config";
import { LoginVM } from "@/session/login/view-model";
import { AppRouter } from "@/shared/lib/use-init-router";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;

// Mock alert
global.alert = jest.fn();

describe("LoginVM", () => {
  let mockContext: Globals;
  let mockAppRouter: AppRouter;
  let mockSession: Session;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAppRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as unknown as AppRouter;

    mockSession = new Session(null);
    mockContext = new Globals(mockAppRouter, mockSession);
  });

  it("should initialize with context", () => {
    const vm = new LoginVM(mockContext);

    expect(vm.context).toBe(mockContext);
  });

  it("should initialize form with default values", () => {
    const vm = new LoginVM(mockContext);

    expect(vm.form.getValues()).toEqual({
      email: "",
      password: "",
    });
  });

  it("should have formState getter", () => {
    const vm = new LoginVM(mockContext);

    expect(vm.formState).toBeDefined();
    expect(vm.formState.errors).toBeDefined();
  });

  describe("login effect", () => {
    it("should have initial idle state", () => {
      const vm = new LoginVM(mockContext);

      expect(vm.login.state.loading).toBe(false);
      expect(vm.login.state.fulfilled).toBe(false);
      expect(vm.login.state.error).toBe(null);
    });

    it("should login successfully and redirect to home", async () => {
      mockSignIn.mockResolvedValue({
        error: undefined,
        status: 200,
        ok: true,
        url: null,
      });
      mockGetSession.mockResolvedValue(null);

      const vm = new LoginVM(mockContext);

      // Mock form values by spying on getValues
      jest.spyOn(vm.form, "getValues").mockReturnValue({
        email: "test@example.com",
        password: "password123",
      });

      await vm.login();

      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
      expect(mockGetSession).toHaveBeenCalled();
      expect(mockAppRouter.replace).toHaveBeenCalledWith("/");
      expect(vm.login.state.fulfilled).toBe(true);
      expect(vm.login.state.loading).toBe(false);
      expect(vm.login.state.error).toBe(null);
    });

    it("should handle login error and show alert", async () => {
      const errorMessage = "Invalid credentials";
      mockSignIn.mockResolvedValue({
        error: errorMessage,
        status: 401,
        ok: false,
        url: null,
      });

      const vm = new LoginVM(mockContext);

      // Mock form values by spying on getValues
      jest.spyOn(vm.form, "getValues").mockReturnValue({
        email: "test@example.com",
        password: "wrongpassword",
      });

      await vm.login();

      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "wrongpassword",
        redirect: false,
      });
      expect(global.alert).toHaveBeenCalledWith(errorMessage);
      expect(mockGetSession).not.toHaveBeenCalled();
      expect(mockAppRouter.replace).not.toHaveBeenCalled();
      expect(vm.login.state.fulfilled).toBe(true);
    });

    it("should handle loading state during login", async () => {
      mockSignIn.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  error: undefined,
                  status: 200,
                  ok: true,
                  url: null,
                }),
              100,
            ),
          ),
      );
      mockGetSession.mockResolvedValue(null);

      const vm = new LoginVM(mockContext);

      // Mock form values by spying on getValues
      jest.spyOn(vm.form, "getValues").mockReturnValue({
        email: "test@example.com",
        password: "password123",
      });

      const loginPromise = vm.login();

      expect(vm.login.state.loading).toBe(true);
      expect(vm.login.state.fulfilled).toBe(false);

      await loginPromise;

      expect(vm.login.state.loading).toBe(false);
      expect(vm.login.state.fulfilled).toBe(true);
    });
  });
});
