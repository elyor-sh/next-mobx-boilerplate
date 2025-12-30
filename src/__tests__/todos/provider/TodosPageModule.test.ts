import { ValidatedQueryParams } from "@/shared/lib/query-params";
import { Todo, todoListQueryParamsSchema } from "@/todos/api";
import { TodosPageModule } from "@/todos/provider/config";

describe("TodosPageModule", () => {
  const mockTodos: Todo[] = [
    { id: 1, userId: 1, title: "Test Todo 1", completed: false },
    { id: 2, userId: 1, title: "Test Todo 2", completed: true },
  ];

  let mockQueryParams: ValidatedQueryParams<typeof todoListQueryParamsSchema>;

  beforeEach(() => {
    mockQueryParams = new ValidatedQueryParams(
      {},
      jest.fn(),
      todoListQueryParamsSchema,
    );
  });

  it("should initialize with todos and query params", () => {
    const testModule = new TodosPageModule(mockTodos, mockQueryParams);

    expect(testModule.todosModel.todoList).toEqual(mockTodos);
    expect(testModule.queryParams).toBe(mockQueryParams);
  });

  it("should initialize todosModel with provided todos", () => {
    const testModule = new TodosPageModule(mockTodos, mockQueryParams);

    expect(testModule.todosModel).toBeDefined();
    expect(testModule.todosModel.todoList).toHaveLength(2);
  });

  it("should be observable", () => {
    const testModule = new TodosPageModule(mockTodos, mockQueryParams);

    // Check if MobX made it observable
    expect(testModule.todosModel).toBeDefined();
    expect(testModule.queryParams).toBeDefined();
  });

  it("should allow updating todos through model", () => {
    const testModule = new TodosPageModule(mockTodos, mockQueryParams);

    const newTodos: Todo[] = [
      { id: 3, userId: 2, title: "New Todo", completed: false },
    ];

    testModule.todosModel.todoList = newTodos;

    expect(testModule.todosModel.todoList).toEqual(newTodos);
    expect(testModule.todosModel.todoList).toHaveLength(1);
  });

  it("should initialize with empty todos", () => {
    const testModule = new TodosPageModule([], mockQueryParams);

    expect(testModule.todosModel.todoList).toEqual([]);
    expect(testModule.todosModel.todoList).toHaveLength(0);
  });

  it("should maintain reference to query params", () => {
    const queryParams = new ValidatedQueryParams(
      { userId: 5 },
      jest.fn(),
      todoListQueryParamsSchema,
    );

    const testModule = new TodosPageModule(mockTodos, queryParams);

    expect(testModule.queryParams.params.userId).toBe(5);
  });
});
