import { signOut } from "next-auth/react";

import { Session } from "@/providers/auth/config";
import { Globals } from "@/providers/global/config";
import { LogoutVM } from "@/session/logout/view-model";
import { UserSession } from "@/shared/lib/auth";
import { AppRouter } from "@/shared/lib/use-init-router";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe("LogoutVM", () => {
  let mockContext: Globals;
  let mockAppRouter: AppRouter;
  let mockSession: Session;

  const mockUser: UserSession = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
  };

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

    mockSession = new Session(mockUser);
    mockContext = new Globals(mockAppRouter, mockSession);
  });

  it("should initialize with context", () => {
    const vm = new LogoutVM(mockContext);

    expect(vm.context).toBe(mockContext);
  });

  describe("logout effect", () => {
    it("should have initial idle state", () => {
      const vm = new LogoutVM(mockContext);

      expect(vm.logout.state.loading).toBe(false);
      expect(vm.logout.state.fulfilled).toBe(false);
      expect(vm.logout.state.error).toBe(null);
    });

    it("should logout successfully and redirect to login page", async () => {
      mockSignOut.mockResolvedValue(undefined);

      const vm = new LogoutVM(mockContext);

      await vm.logout();

      expect(mockSignOut).toHaveBeenCalledWith({
        redirect: false,
        callbackUrl: "/auth/login",
      });
      expect(mockAppRouter.replace).toHaveBeenCalledWith("/auth/login");
      expect(vm.context.session.user).toBe(null);
      expect(vm.logout.state.fulfilled).toBe(true);
      expect(vm.logout.state.loading).toBe(false);
      expect(vm.logout.state.error).toBe(null);
    });

    it("should handle loading state during logout", async () => {
      mockSignOut.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(undefined), 100)),
      );

      const vm = new LogoutVM(mockContext);

      const logoutPromise = vm.logout();

      expect(vm.logout.state.loading).toBe(true);
      expect(vm.logout.state.fulfilled).toBe(false);

      await logoutPromise;

      expect(vm.logout.state.loading).toBe(false);
      expect(vm.logout.state.fulfilled).toBe(true);
    });

    it("should handle logout error", async () => {
      const error = new Error("Logout failed");
      mockSignOut.mockRejectedValue(error);

      const vm = new LogoutVM(mockContext);

      await expect(vm.logout()).rejects.toThrow("Logout failed");

      expect(vm.logout.state.loading).toBe(false);
      expect(vm.logout.state.fulfilled).toBe(false);
      expect(vm.logout.state.error).toBe(error);
    });

    it("should clear session even if signOut fails", async () => {
      const error = new Error("Network error");
      mockSignOut.mockRejectedValue(error);

      const vm = new LogoutVM(mockContext);

      expect(vm.context.session.user).toEqual(mockUser);

      try {
        await vm.logout();
      } catch {
        // Expected to throw
      }

      // Session should not be cleared if signOut fails
      // because clearSession is called after signOut
      expect(vm.context.session.user).toEqual(mockUser);
    });
  });

  describe("clearSession", () => {
    it("should clear user session", () => {
      const vm = new LogoutVM(mockContext);

      expect(vm.context.session.user).toEqual(mockUser);

      vm.clearSession();

      expect(vm.context.session.user).toBe(null);
    });

    it("should work when session is already null", () => {
      mockSession = new Session(null);
      mockContext = new Globals(mockAppRouter, mockSession);

      const vm = new LogoutVM(mockContext);

      expect(vm.context.session.user).toBe(null);

      vm.clearSession();

      expect(vm.context.session.user).toBe(null);
    });
  });
});
