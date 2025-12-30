import { Session } from "@/providers/auth/config";
import { UserSession } from "@/shared/lib/auth";

describe("Session", () => {
  const mockUser: UserSession = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  };

  it("should initialize with null user", () => {
    const session = new Session(null);

    expect(session.user).toBe(null);
  });

  it("should initialize with user", () => {
    const session = new Session(mockUser);

    expect(session.user).toEqual(mockUser);
  });

  it("should be observable", () => {
    const session = new Session(mockUser);

    expect(session.user).toBeDefined();
  });

  it("should allow updating user", () => {
    const session = new Session(null);

    session.user = mockUser;

    expect(session.user).toEqual(mockUser);
  });

  it("should allow clearing user", () => {
    const session = new Session(mockUser);

    session.user = null;

    expect(session.user).toBe(null);
  });

  it("should handle user updates", () => {
    const session = new Session(mockUser);

    const updatedUser: UserSession = {
      ...mockUser,
      name: "Jane Doe",
    };

    session.user = updatedUser;

    expect(session.user?.name).toBe("Jane Doe");
    expect(session.user?.email).toBe("john@example.com");
  });
});
