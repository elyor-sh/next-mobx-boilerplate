import { makeAutoObservable } from "mobx";

import { Todo } from "@/todos/api";

export class TodosModel {
  todoList: Todo[];

  constructor(initialTodos: Todo[]) {
    this.todoList = initialTodos;
    makeAutoObservable(this, undefined, { autoBind: true });
  }
}
