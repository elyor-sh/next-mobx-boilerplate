import { UsersSelectVM } from "@/pickers/user-select/view-model";
import { Session } from "@/providers/auth/config";
import { Globals } from "@/providers/global/config";
import { AppRouter } from "@/shared/lib/use-init-router";
import { getUsers, Users } from "@/users/api";

jest.mock("@/users/api", () => ({
  ...jest.requireActual("@/users/api"),
  getUsers: jest.fn(),
}));

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

describe("UsersSelectVM", () => {
  const mockUsers: Users[] = [
    {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      address: {
        street: "Main St",
        suite: "Apt 1",
        city: "New York",
        zipcode: "10001",
        geo: { lat: "40.7128", lng: "-74.0060" },
      },
      phone: "123-456-7890",
      website: "johndoe.com",
      company: {
        name: "Acme Corp",
        catchPhrase: "Innovation",
        bs: "synergize",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      address: {
        street: "Second St",
        suite: "Apt 2",
        city: "Los Angeles",
        zipcode: "90001",
        geo: { lat: "34.0522", lng: "-118.2437" },
      },
      phone: "098-765-4321",
      website: "janesmith.com",
      company: {
        name: "Tech Inc",
        catchPhrase: "Technology",
        bs: "innovate",
      },
    },
  ];

  let mockContext: Globals;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockAppRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as unknown as AppRouter;

    const mockSession = new Session(null);
    mockContext = new Globals(mockAppRouter, mockSession);
  });

  it("should initialize with empty users array", () => {
    const vm = new UsersSelectVM(mockContext);

    expect(vm.users).toEqual([]);
    expect(vm.context).toBe(mockContext);
  });

  it("should load users successfully", async () => {
    mockGetUsers.mockResolvedValue(mockUsers);

    const vm = new UsersSelectVM(mockContext);

    await vm.loadUsers();

    expect(vm.loadUsers.state.fulfilled).toBe(true);
    expect(vm.loadUsers.state.loading).toBe(false);
    expect(vm.loadUsers.state.error).toBe(null);
  });

  it("should transform users to lookup format", async () => {
    mockGetUsers.mockResolvedValue(mockUsers);

    const vm = new UsersSelectVM(mockContext);

    await vm.loadUsers();

    expect(vm.users).toEqual([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ]);
  });

  it("should handle loading state", async () => {
    mockGetUsers.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockUsers), 100)),
    );

    const vm = new UsersSelectVM(mockContext);

    const loadPromise = vm.loadUsers();

    expect(vm.loadUsers.state.loading).toBe(true);
    expect(vm.loadUsers.state.fulfilled).toBe(false);

    await loadPromise;

    expect(vm.loadUsers.state.loading).toBe(false);
    expect(vm.loadUsers.state.fulfilled).toBe(true);
  });

  it("should handle error state", async () => {
    const error = new Error("Failed to load users");
    mockGetUsers.mockRejectedValue(error);

    const vm = new UsersSelectVM(mockContext);

    await expect(vm.loadUsers()).rejects.toThrow("Failed to load users");

    expect(vm.loadUsers.state.loading).toBe(false);
    expect(vm.loadUsers.state.fulfilled).toBe(false);
    expect(vm.loadUsers.state.error).toBe(error);
  });

  it("should set users lookup using setUsersLookup", () => {
    const vm = new UsersSelectVM(mockContext);

    vm.setUsersLookup(mockUsers);

    expect(vm.users).toEqual([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ]);
  });

  it("should handle empty users array", async () => {
    mockGetUsers.mockResolvedValue([]);

    const vm = new UsersSelectVM(mockContext);

    await vm.loadUsers();

    expect(vm.users).toEqual([]);
  });

  it("should pass abort signal to getUsers", async () => {
    mockGetUsers.mockResolvedValue(mockUsers);

    const vm = new UsersSelectVM(mockContext);

    await vm.loadUsers();

    expect(mockGetUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
