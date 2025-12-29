import { appendAutoRun } from "@/shared/lib/autorun";
import { createEffect } from "@/shared/lib/create-effect";
import { ViewModelConstructor } from "@/shared/lib/create-use-store";
import { makeViewModel } from "@/shared/lib/make-view-model";
import { getTodos, Todo, todoListQueryParamsSchema } from "@/todos/api";
import { TodosPageModuleContextType } from "@/todos/provider/config";

type ViewModel = ViewModelConstructor<TodosPageModuleContextType>;

export class TodoListVM implements ViewModel {
  constructor(public context: TodosPageModuleContextType) {
    makeViewModel(this);
  }

  loadTodos = createEffect(async ({ signal }) => {
    const params = todoListQueryParamsSchema
      .strip()
      .parse(this.context.queryParams.params);
    const todos = await getTodos({ ...params, signal });
    this.setTodos(todos);
  });

  setTodos(todos: Todo[]) {
    this.context.todosModel.todoList = todos;
  }

  afterMount() {
    appendAutoRun(this, () => this.loadTodos());
  }

  beforeUnmount() {
    this.loadTodos.abortController?.abort();
  }
}
