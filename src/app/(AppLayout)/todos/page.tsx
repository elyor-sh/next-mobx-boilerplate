import Link from "next/link";

import {
  getTodos,
  TodoListQueryParams,
  todoListQueryParamsSchema,
} from "@/todos/api";
import { TodoListFilter } from "@/todos/features/filter";
import { TodosProvider } from "@/todos/provider";
import { TodosList } from "@/todos/ui";

type Params = {
  searchParams: Promise<TodoListQueryParams>;
};

export default async function TodosPage(props: Params) {
  const searchParams = await props.searchParams;
  const todos = await getTodos(todoListQueryParamsSchema.parse(searchParams));

  return (
    <TodosProvider initialTodos={todos}>
      <Link href="/" replace className="py-3 text-blue-500">
        {"<"} Go back
      </Link>
      <h1 className="mb-3">Todos page</h1>
      <div className="mb-3">
        <TodoListFilter />
      </div>
      <TodosList />
    </TodosProvider>
  );
}
