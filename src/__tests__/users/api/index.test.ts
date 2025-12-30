import { http } from "@/shared/http";
import { getUsers, usersSchema } from "@/users/api";

jest.mock("@/shared/http");

const mockHttp = http as jest.Mocked<typeof http>;

describe("Users API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usersSchema", () => {
    const validUser = {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      address: {
        street: "Main St",
        suite: "Apt 1",
        city: "New York",
        zipcode: "10001",
        geo: {
          lat: "40.7128",
          lng: "-74.0060",
        },
      },
      phone: "123-456-7890",
      website: "johndoe.com",
      company: {
        name: "Acme Corp",
        catchPhrase: "Innovation",
        bs: "synergize",
      },
    };

    it("should validate valid user object", () => {
      const result = usersSchema.parse(validUser);

      expect(result).toEqual(validUser);
    });

    it("should reject user with invalid email", () => {
      const invalidUser = {
        ...validUser,
        email: "not-an-email",
      };

      expect(() => usersSchema.parse(invalidUser)).toThrow();
    });

    it("should reject user without required fields", () => {
      const incompleteUser = {
        id: 1,
        name: "John Doe",
      };

      expect(() => usersSchema.parse(incompleteUser)).toThrow();
    });

    it("should validate nested address object", () => {
      const result = usersSchema.parse(validUser);

      expect(result.address).toEqual(validUser.address);
      expect(result.address.geo.lat).toBe("40.7128");
    });

    it("should validate nested company object", () => {
      const result = usersSchema.parse(validUser);

      expect(result.company).toEqual(validUser.company);
    });

    it("should validate array of users", () => {
      const users = [validUser, { ...validUser, id: 2, name: "Jane Doe" }];

      const result = usersSchema.array().parse(users);

      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });
  });

  describe("getUsers", () => {
    const mockUsers = [
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

    it("should fetch users successfully", async () => {
      mockHttp.get.mockResolvedValue({ data: mockUsers });

      const result = await getUsers({});

      expect(result).toEqual(mockUsers);
      expect(mockHttp.get).toHaveBeenCalledWith("/users", {
        signal: undefined,
      });
    });

    it("should pass abort signal", async () => {
      mockHttp.get.mockResolvedValue({ data: mockUsers });
      const controller = new AbortController();

      await getUsers({ signal: controller.signal });

      expect(mockHttp.get).toHaveBeenCalledWith("/users", {
        signal: controller.signal,
      });
    });

    it("should validate response data", async () => {
      const invalidData = [
        {
          id: 1,
          name: "John",
          email: "invalid-email",
        },
      ];

      mockHttp.get.mockResolvedValue({ data: invalidData });

      await expect(getUsers({})).rejects.toThrow();
    });

    it("should handle empty response", async () => {
      mockHttp.get.mockResolvedValue({ data: [] });

      const result = await getUsers({});

      expect(result).toEqual([]);
    });

    it("should handle network errors", async () => {
      const error = new Error("Network error");
      mockHttp.get.mockRejectedValue(error);

      await expect(getUsers({})).rejects.toThrow("Network error");
    });
  });
});
