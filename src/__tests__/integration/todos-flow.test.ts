/**
 * Integration test for complete todos flow
 * Tests interaction between ViewModel, Model and API
 */

import { expect } from "@jest/globals";

import { ValidatedQueryParams } from "@/shared/lib/query-params";
import { getTodos, Todo, todoListQueryParamsSchema } from "@/todos/api";
import { TodosPageModule } from "@/todos/provider/config";
import { TodoListVM } from "@/todos/view-model";

jest.mock("@/todos/api", () => ({
  ...jest.requireActual("@/todos/api"),
  getTodos: jest.fn(),
}));

const mockGetTodos = getTodos as jest.MockedFunction<typeof getTodos>;

describe("Todos Integration Flow", () => {
  const mockTodos: Todo[] = [
    { id: 1, userId: 1, title: "Buy groceries", completed: false },
    { id: 2, userId: 1, title: "Walk the dog", completed: true },
    { id: 3, userId: 1, title: "Read a book", completed: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should complete full todos loading flow", async () => {
    // 1. Setup: Create testModule with empty todos
    const queryParams = new ValidatedQueryParams(
      { userId: 1 },
      jest.fn(),
      todoListQueryParamsSchema,
    );
    const testModule = new TodosPageModule([], queryParams);

    expect(testModule.todosModel.todoList).toHaveLength(0);

    // 2. Create ViewModel
    const vm = new TodoListVM(testModule);

    expect(vm.loadTodos.state.loading).toBe(false);
    expect(vm.loadTodos.state.fulfilled).toBe(false);

    // 3. Mock API response
    mockGetTodos.mockResolvedValue(mockTodos);

    // 4. Load todos
    const loadPromise = vm.loadTodos();

    // 5. Check loading state
    expect(vm.loadTodos.state.loading).toBe(true);

    // 6. Wait for completion
    await loadPromise;

    // 7. Verify final state
    expect(vm.loadTodos.state.loading).toBe(false);
    expect(vm.loadTodos.state.fulfilled).toBe(true);
    expect(vm.loadTodos.state.error).toBe(null);

    // 8. Verify data in model
    expect(testModule.todosModel.todoList).toEqual(mockTodos);
    expect(testModule.todosModel.todoList).toHaveLength(3);

    // 9. Verify API was called with correct params
    expect(mockGetTodos).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("should handle filtering by userId", async () => {
    // Setup with different userId
    const queryParams = new ValidatedQueryParams(
      { userId: 2 },
      jest.fn(),
      todoListQueryParamsSchema,
    );
    const testModule = new TodosPageModule([], queryParams);
    const vm = new TodoListVM(testModule);

    const filteredTodos = mockTodos.filter((todo) => todo.userId === 2);
    mockGetTodos.mockResolvedValue(filteredTodos);

    await vm.loadTodos();

    expect(mockGetTodos).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 2,
      }),
    );
  });

  it("should handle error and recovery flow", async () => {
    const queryParams = new ValidatedQueryParams(
      {},
      jest.fn(),
      todoListQueryParamsSchema,
    );
    const testModule = new TodosPageModule([], queryParams);
    const vm = new TodoListVM(testModule);

    // 1. First attempt fails
    const error = new Error("Network error");
    mockGetTodos.mockRejectedValueOnce(error);

    await expect(vm.loadTodos()).rejects.toThrow("Network error");

    expect(vm.loadTodos.state.error).toBe(error);
    expect(vm.loadTodos.state.fulfilled).toBe(false);
    expect(testModule.todosModel.todoList).toHaveLength(0);

    // 2. Second attempt succeeds
    mockGetTodos.mockResolvedValueOnce(mockTodos);

    await vm.loadTodos();

    expect(vm.loadTodos.state.error).toBe(null);
    expect(vm.loadTodos.state.fulfilled).toBe(true);
    expect(testModule.todosModel.todoList).toEqual(mockTodos);
  });

  it("should handle request cancellation flow", async () => {
    const queryParams = new ValidatedQueryParams(
      {},
      jest.fn(),
      todoListQueryParamsSchema,
    );
    const testModule = new TodosPageModule([], queryParams);
    const vm = new TodoListVM(testModule);

    // 1. Start first request
    mockGetTodos.mockImplementation(
      ({ signal }) =>
        new Promise((resolve, reject) => {
          const timeout = setTimeout(() => resolve(mockTodos), 100);
          signal?.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Aborted"));
          });
        }),
    );

    const firstRequest = vm.loadTodos();
    const firstController = vm.loadTodos.abortController;

    // 2. Start second request (should cancel first)
    const secondRequest = vm.loadTodos();

    // 3. Verify first request was aborted
    expect(firstController?.signal.aborted).toBe(true);

    // 4. First request should fail
    await expect(firstRequest).rejects.toThrow();

    // 5. Second request should succeed
    await secondRequest;

    expect(vm.loadTodos.state.fulfilled).toBe(true);
    expect(testModule.todosModel.todoList).toEqual(mockTodos);
  });

  it("should handle manual todo updates", async () => {
    const queryParams = new ValidatedQueryParams(
      {},
      jest.fn(),
      todoListQueryParamsSchema,
    );
    const testModule = new TodosPageModule(mockTodos, queryParams);
    const vm = new TodoListVM(testModule);

    // Initial state
    expect(testModule.todosModel.todoList).toHaveLength(3);

    // Update todos manually
    const updatedTodos = mockTodos.map((todo) =>
      todo.id === 1 ? { ...todo, completed: true } : todo,
    );

    vm.setTodos(updatedTodos);

    expect(testModule.todosModel.todoList).toEqual(updatedTodos);
    expect(testModule.todosModel.todoList[0].completed).toBe(true);
  });
});
