"use client";

import {TodosModel} from "@/todos/model";
import {Todo, TodoListQueryParams} from "@/todos/api";
import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {createUseStore} from "@/shared/lib/create-use-store";
import {ValidatedQueryParams} from "@/shared/lib/query-params";

export class TodosPageModule {
    todosModel: TodosModel;
    queryParams: ValidatedQueryParams<TodoListQueryParams>

    constructor(initialTodos: Todo[], queryParams: ValidatedQueryParams<TodoListQueryParams>) {
        this.todosModel = new TodosModel(initialTodos);
        this.queryParams = queryParams;
        makeAutoObservable(this, undefined, {autoBind: true})
    }
}

export const TodosPageModuleContext = createContext<TodosPageModule | undefined>(undefined);

export type TodosPageModuleContextType = TodosPageModule

export const useTodosPageModuleContext = createUseStore(TodosPageModuleContext)