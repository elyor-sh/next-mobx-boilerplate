import { loginSchema } from "@/session/login/api";

describe("loginSchema", () => {
  it("should validate correct email and password", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
    };

    const result = loginSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  describe("email validation", () => {
    it("should reject invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email");
      }
    });

    it("should reject empty email", () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should accept valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "test.user@example.co.uk",
        "user+tag@example.com",
      ];

      validEmails.forEach((email) => {
        const result = loginSchema.safeParse({
          email,
          password: "password123",
        });

        expect(result.success).toBe(true);
      });
    });
  });

  describe("password validation", () => {
    it("should reject password shorter than 6 characters", () => {
      const invalidData = {
        email: "test@example.com",
        password: "12345",
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Minimum 6 characters");
      }
    });

    it("should accept password with exactly 6 characters", () => {
      const validData = {
        email: "test@example.com",
        password: "123456",
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should accept password longer than 6 characters", () => {
      const validData = {
        email: "test@example.com",
        password: "verylongpassword123",
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  it("should reject missing fields", () => {
    const invalidData = {};

    const result = loginSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("should reject data with only email", () => {
    const invalidData = {
      email: "test@example.com",
    };

    const result = loginSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("should reject data with only password", () => {
    const invalidData = {
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});
