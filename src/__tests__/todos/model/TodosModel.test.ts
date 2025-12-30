import { Todo } from "@/todos/api";
import { TodosModel } from "@/todos/model";

describe("TodosModel", () => {
  const mockTodos: Todo[] = [
    { id: 1, userId: 1, title: "Test Todo 1", completed: false },
    { id: 2, userId: 1, title: "Test Todo 2", completed: true },
  ];

  it("should initialize with provided todos", () => {
    const model = new TodosModel(mockTodos);

    expect(model.todoList).toEqual(mockTodos);
    expect(model.todoList).toHaveLength(2);
  });

  it("should be observable and allow updates", () => {
    const model = new TodosModel(mockTodos);

    const newTodos: Todo[] = [
      { id: 3, userId: 2, title: "New Todo", completed: false },
    ];

    model.todoList = newTodos;

    expect(model.todoList).toEqual(newTodos);
    expect(model.todoList).toHaveLength(1);
  });

  it("should initialize with empty array", () => {
    const model = new TodosModel([]);

    expect(model.todoList).toEqual([]);
    expect(model.todoList).toHaveLength(0);
  });

  it("should allow adding todos to the list", () => {
    const model = new TodosModel(mockTodos);

    const newTodo: Todo = {
      id: 3,
      userId: 1,
      title: "New Todo",
      completed: false,
    };

    model.todoList = [...model.todoList, newTodo];

    expect(model.todoList).toHaveLength(3);
    expect(model.todoList[2]).toEqual(newTodo);
  });

  it("should allow removing todos from the list", () => {
    const model = new TodosModel(mockTodos);

    model.todoList = model.todoList.filter((todo) => todo.id !== 1);

    expect(model.todoList).toHaveLength(1);
    expect(model.todoList[0].id).toBe(2);
  });

  it("should allow updating specific todo", () => {
    const model = new TodosModel(mockTodos);

    model.todoList = model.todoList.map((todo) =>
      todo.id === 1 ? { ...todo, completed: true } : todo,
    );

    expect(model.todoList[0].completed).toBe(true);
    expect(model.todoList[1].completed).toBe(true);
  });
});
