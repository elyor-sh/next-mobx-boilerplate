import { ValidatedQueryParams } from "@/shared/lib/query-params";
import { todoListQueryParamsSchema, getTodos, Todo } from "@/todos/api";
import { TodosPageModule } from "@/todos/provider/config";
import { TodoListVM } from "@/todos/view-model";

// Mock the API
jest.mock("@/todos/api", () => ({
  ...jest.requireActual("@/todos/api"),
  getTodos: jest.fn(),
}));

const mockGetTodos = getTodos as jest.MockedFunction<typeof getTodos>;

describe("TodoListVM", () => {
  const mockTodos: Todo[] = [
    { id: 1, userId: 1, title: "Test Todo 1", completed: false },
    { id: 2, userId: 1, title: "Test Todo 2", completed: true },
  ];

  let mockContext: TodosPageModule;
  let mockQueryParams: ValidatedQueryParams<typeof todoListQueryParamsSchema>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueryParams = new ValidatedQueryParams(
      {},
      jest.fn(),
      todoListQueryParamsSchema,
    );

    mockContext = new TodosPageModule([], mockQueryParams);
  });

  it("should initialize with context", () => {
    const vm = new TodoListVM(mockContext);

    expect(vm.context).toBe(mockContext);
  });

  it("should load todos successfully", async () => {
    mockGetTodos.mockResolvedValue(mockTodos);

    const vm = new TodoListVM(mockContext);

    await vm.loadTodos();

    expect(vm.loadTodos.state.fulfilled).toBe(true);
    expect(vm.loadTodos.state.loading).toBe(false);
    expect(vm.loadTodos.state.error).toBe(null);
    expect(vm.context.todosModel.todoList).toEqual(mockTodos);
  });

  it("should handle loading state", async () => {
    mockGetTodos.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockTodos), 100)),
    );

    const vm = new TodoListVM(mockContext);

    const loadPromise = vm.loadTodos();

    expect(vm.loadTodos.state.loading).toBe(true);
    expect(vm.loadTodos.state.fulfilled).toBe(false);

    await loadPromise;

    expect(vm.loadTodos.state.loading).toBe(false);
    expect(vm.loadTodos.state.fulfilled).toBe(true);
  });

  it("should handle error state", async () => {
    const error = new Error("Failed to load todos");
    mockGetTodos.mockRejectedValue(error);

    const vm = new TodoListVM(mockContext);

    await expect(vm.loadTodos()).rejects.toThrow("Failed to load todos");

    expect(vm.loadTodos.state.loading).toBe(false);
    expect(vm.loadTodos.state.fulfilled).toBe(false);
    expect(vm.loadTodos.state.error).toBe(error);
  });

  it("should set todos using setTodos method", () => {
    const vm = new TodoListVM(mockContext);

    vm.setTodos(mockTodos);

    expect(vm.context.todosModel.todoList).toEqual(mockTodos);
  });

  it("should pass query params to getTodos", async () => {
    mockGetTodos.mockResolvedValue(mockTodos);

    mockQueryParams = new ValidatedQueryParams(
      { userId: 1 },
      jest.fn(),
      todoListQueryParamsSchema,
    );
    mockContext = new TodosPageModule([], mockQueryParams);

    const vm = new TodoListVM(mockContext);

    await vm.loadTodos();

    expect(mockGetTodos).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("should abort previous request when loading again", async () => {
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

    const vm = new TodoListVM(mockContext);

    const firstLoad = vm.loadTodos();
    const firstController = vm.loadTodos.abortController;

    const secondLoad = vm.loadTodos();

    expect(firstController?.signal.aborted).toBe(true);

    await expect(firstLoad).rejects.toThrow();
    await secondLoad;
  });

  it("should abort request on beforeUnmount", async () => {
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

    const vm = new TodoListVM(mockContext);

    const loadPromise = vm.loadTodos();
    const controller = vm.loadTodos.abortController;

    vm.beforeUnmount();

    expect(controller?.signal.aborted).toBe(true);
    await expect(loadPromise).rejects.toThrow();
  });
});
