import { Users } from "@/users/api";
import { UsersPageModule } from "@/users/provider/config";

describe("UsersPageModule", () => {
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
  ];

  it("should initialize with users", () => {
    const testModule = new UsersPageModule(mockUsers);

    expect(testModule.usersModel.users).toEqual(mockUsers);
  });

  it("should initialize usersModel with provided users", () => {
    const testModule = new UsersPageModule(mockUsers);

    expect(testModule.usersModel).toBeDefined();
    expect(testModule.usersModel.users).toHaveLength(1);
  });

  it("should allow updating users through model", () => {
    const testModule = new UsersPageModule(mockUsers);

    const newUsers: Users[] = [];
    testModule.usersModel.setUsers(newUsers);

    expect(testModule.usersModel.users).toEqual(newUsers);
    expect(testModule.usersModel.users).toHaveLength(0);
  });

  it("should initialize with empty users", () => {
    const testModule = new UsersPageModule([]);

    expect(testModule.usersModel.users).toEqual([]);
    expect(testModule.usersModel.users).toHaveLength(0);
  });
});
