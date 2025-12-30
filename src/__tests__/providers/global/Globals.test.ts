import { Session } from "@/providers/auth/config";
import { Globals } from "@/providers/global/config";
import { AppRouter } from "@/shared/lib/use-init-router";

describe("Globals", () => {
  let mockAppRouter: AppRouter;
  let mockSession: Session;

  beforeEach(() => {
    // Mock AppRouter
    mockAppRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as unknown as AppRouter;

    // Mock Session
    mockSession = new Session(null);
  });

  it("should initialize with appRouter and session", () => {
    const globals = new Globals(mockAppRouter, mockSession);

    expect(globals.appRouter).toBe(mockAppRouter);
    expect(globals.session).toBe(mockSession);
  });

  it("should maintain reference to appRouter", () => {
    const globals = new Globals(mockAppRouter, mockSession);

    expect(globals.appRouter).toBeDefined();
    expect(globals.appRouter.push).toBeDefined();
  });

  it("should maintain reference to session", () => {
    const globals = new Globals(mockAppRouter, mockSession);

    expect(globals.session).toBeDefined();
    expect(globals.session.user).toBe(null);
  });

  it("should allow accessing appRouter methods", () => {
    const globals = new Globals(mockAppRouter, mockSession);

    globals.appRouter.push("/test");

    expect(mockAppRouter.push).toHaveBeenCalledWith("/test");
  });
});
