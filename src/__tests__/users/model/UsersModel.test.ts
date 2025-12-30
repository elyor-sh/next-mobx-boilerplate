import { Users } from "@/users/api";
import { UsersModel } from "@/users/model";

describe("UsersModel", () => {
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

  it("should initialize with provided users", () => {
    const model = new UsersModel(mockUsers);

    expect(model.users).toEqual(mockUsers);
    expect(model.users).toHaveLength(2);
  });

  it("should update users using setUsers method", () => {
    const model = new UsersModel(mockUsers);

    const newUsers: Users[] = [mockUsers[0]];
    model.setUsers(newUsers);

    expect(model.users).toEqual(newUsers);
    expect(model.users).toHaveLength(1);
  });

  it("should initialize with empty array", () => {
    const model = new UsersModel([]);

    expect(model.users).toEqual([]);
    expect(model.users).toHaveLength(0);
  });

  it("should be observable and allow direct updates", () => {
    const model = new UsersModel(mockUsers);

    model.users = [mockUsers[1]];

    expect(model.users).toHaveLength(1);
    expect(model.users[0].name).toBe("Jane Smith");
  });

  it("should allow clearing all users", () => {
    const model = new UsersModel(mockUsers);

    model.setUsers([]);

    expect(model.users).toEqual([]);
    expect(model.users).toHaveLength(0);
  });
});
