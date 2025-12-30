import { http } from "@/shared/http";
import { getTodos, todoSchema, todoListQueryParamsSchema } from "@/todos/api";

jest.mock("@/shared/http");

const mockHttp = http as jest.Mocked<typeof http>;

describe("Todos API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("todoSchema", () => {
    it("should validate valid todo object", () => {
      const validTodo = {
        id: 1,
        userId: 1,
        title: "Test Todo",
        completed: false,
      };

      const result = todoSchema.parse(validTodo);

      expect(result).toEqual(validTodo);
    });

    it("should reject invalid todo object", () => {
      const invalidTodo = {
        id: "not-a-number",
        userId: 1,
        title: "Test Todo",
        completed: false,
      };

      expect(() => todoSchema.parse(invalidTodo)).toThrow();
    });

    it("should reject todo without required fields", () => {
      const incompleteTodo = {
        id: 1,
        title: "Test Todo",
      };

      expect(() => todoSchema.parse(incompleteTodo)).toThrow();
    });

    it("should validate array of todos", () => {
      const todos = [
        { id: 1, userId: 1, title: "Todo 1", completed: false },
        { id: 2, userId: 1, title: "Todo 2", completed: true },
      ];

      const result = todoSchema.array().parse(todos);

      expect(result).toEqual(todos);
      expect(result).toHaveLength(2);
    });
  });

  describe("todoListQueryParamsSchema", () => {
    it("should validate query params with userId", () => {
      const params = { userId: 1 };

      const result = todoListQueryParamsSchema.parse(params);

      expect(result.userId).toBe(1);
    });

    it("should coerce string userId to number", () => {
      const params = { userId: "123" };

      const result = todoListQueryParamsSchema.parse(params);

      expect(result.userId).toBe(123);
      expect(typeof result.userId).toBe("number");
    });

    it("should allow optional userId", () => {
      const params = {};

      const result = todoListQueryParamsSchema.parse(params);

      expect(result.userId).toBeUndefined();
    });

    it("should reject invalid userId", () => {
      const params = { userId: "not-a-number" };

      expect(() => todoListQueryParamsSchema.parse(params)).toThrow(
        "Invalid user id",
      );
    });
  });

  describe("getTodos", () => {
    const mockTodos = [
      { id: 1, userId: 1, title: "Todo 1", completed: false },
      { id: 2, userId: 1, title: "Todo 2", completed: true },
    ];

    it("should fetch todos successfully", async () => {
      mockHttp.get.mockResolvedValue({ data: mockTodos });

      const result = await getTodos({});

      expect(result).toEqual(mockTodos);
      expect(mockHttp.get).toHaveBeenCalledWith("/todos", {
        params: {},
        signal: undefined,
      });
    });

    it("should pass query params to http client", async () => {
      mockHttp.get.mockResolvedValue({ data: mockTodos });

      await getTodos({ userId: 1 });

      expect(mockHttp.get).toHaveBeenCalledWith("/todos", {
        params: { userId: 1 },
        signal: undefined,
      });
    });

    it("should pass abort signal", async () => {
      mockHttp.get.mockResolvedValue({ data: mockTodos });
      const controller = new AbortController();

      await getTodos({ signal: controller.signal });

      expect(mockHttp.get).toHaveBeenCalledWith("/todos", {
        params: {},
        signal: controller.signal,
      });
    });

    it("should validate response data", async () => {
      const invalidData = [
        { id: "invalid", userId: 1, title: "Todo", completed: false },
      ];

      mockHttp.get.mockResolvedValue({ data: invalidData });

      await expect(getTodos({})).rejects.toThrow();
    });

    it("should handle empty response", async () => {
      mockHttp.get.mockResolvedValue({ data: [] });

      const result = await getTodos({});

      expect(result).toEqual([]);
    });

    it("should handle network errors", async () => {
      const error = new Error("Network error");
      mockHttp.get.mockRejectedValue(error);

      await expect(getTodos({})).rejects.toThrow("Network error");
    });
  });
});
