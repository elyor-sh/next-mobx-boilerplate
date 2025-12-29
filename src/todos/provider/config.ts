"use client";

import { makeAutoObservable } from "mobx";
import { createContext } from "react";

import { createUseStore } from "@/shared/lib/create-use-store";
import { ValidatedQueryParams } from "@/shared/lib/query-params";
import { Todo, todoListQueryParamsSchema } from "@/todos/api";
import { TodosModel } from "@/todos/model";

export class TodosPageModule {
  todosModel: TodosModel;
  queryParams: ValidatedQueryParams<typeof todoListQueryParamsSchema>;

  constructor(
    initialTodos: Todo[],
    queryParams: ValidatedQueryParams<typeof todoListQueryParamsSchema>,
  ) {
    this.todosModel = new TodosModel(initialTodos);
    this.queryParams = queryParams;
    makeAutoObservable(this, undefined, { autoBind: true });
  }
}

export const TodosPageModuleContext = createContext<
  TodosPageModule | undefined
>(undefined);

export type TodosPageModuleContextType = TodosPageModule;

export const useTodosPageModuleContext = createUseStore(TodosPageModuleContext);
