import {defaultListParams} from "@/shared/constants/default-params";
import {z} from "zod";
import {http} from "@/shared/http";

export const todoListQueryParamsSchema = z.object({
  ...defaultListParams,
  userId: z.coerce.number({ message: "Invalid user id" }).optional(),
});

export const todoSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof todoSchema>;

export type TodoListQueryParams = z.infer<typeof todoListQueryParamsSchema>;

export async function getTodos({signal, ...queryParams}: TodoListQueryParams & {signal?: AbortSignal}) {
  const {data} = await http.get<Todo[]>("/todos", {
    params: queryParams,
    signal
  });
  return todoSchema.array().parse(data);
}