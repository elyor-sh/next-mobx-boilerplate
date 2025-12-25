import {getTodos, TodoListQueryParams, todoListQueryParamsSchema} from "@/todos/api";

type Params = {
  searchParams: Promise<TodoListQueryParams>
}

export default async function TodosPage (props: Params) {
  const searchParams = await props.searchParams;
  const todos = await getTodos(todoListQueryParamsSchema.parse(searchParams));

  return (
    <div>
      <h1>Todos</h1>
    </div>
  );
}