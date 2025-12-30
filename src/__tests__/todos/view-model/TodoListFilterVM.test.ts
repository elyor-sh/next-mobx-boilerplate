import { ValidatedQueryParams } from "@/shared/lib/query-params";
import { todoListQueryParamsSchema } from "@/todos/api";
import { TodoListFilterVM } from "@/todos/features/filter/view-model";
import { TodosPageModule } from "@/todos/provider/config";

describe("TodoListFilterVM", () => {
  let mockContext: TodosPageModule;
  let mockQueryParams: ValidatedQueryParams<typeof todoListQueryParamsSchema>;
  let mockSetQueryParams: jest.Mock;

  beforeEach(() => {
    mockSetQueryParams = jest.fn();

    mockQueryParams = new ValidatedQueryParams(
      { userId: 1 },
      mockSetQueryParams,
      todoListQueryParamsSchema,
    );

    mockContext = new TodosPageModule([], mockQueryParams);
  });

  it("should initialize with context", () => {
    const vm = new TodoListFilterVM(mockContext);

    expect(vm.context).toBe(mockContext);
  });

  it("should return current query params values", () => {
    const vm = new TodoListFilterVM(mockContext);

    expect(vm.values).toEqual({ userId: 1, _page: 0, _limit: 20 });
  });

  it("should update query params using setValue", () => {
    const vm = new TodoListFilterVM(mockContext);

    vm.setValue({ userId: 2 });

    expect(mockSetQueryParams).toHaveBeenCalledWith({ userId: 2 });
    expect(vm.context.queryParams.params.userId).toBe(2);
  });

  it("should handle partial updates", () => {
    mockQueryParams = new ValidatedQueryParams(
      { userId: 1 },
      mockSetQueryParams,
      todoListQueryParamsSchema,
    );
    mockContext = new TodosPageModule([], mockQueryParams);

    const vm = new TodoListFilterVM(mockContext);

    vm.setValue({ userId: 3 });

    expect(mockSetQueryParams).toHaveBeenCalledWith({ userId: 3 });
  });

  it("should reflect changes in values getter", () => {
    const vm = new TodoListFilterVM(mockContext);

    expect(vm.values.userId).toBe(1);

    vm.setValue({ userId: 5 });

    expect(vm.values.userId).toBe(5);
  });

  it("should handle clearing userId", () => {
    const vm = new TodoListFilterVM(mockContext);

    vm.setValue({ userId: undefined });

    expect(mockSetQueryParams).toHaveBeenCalledWith({ userId: undefined });
  });
});
