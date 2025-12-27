import {Todo} from "@/todos/api";
import {makeAutoObservable} from "mobx";

export class TodosModel {
    todoList: Todo[];

    constructor(initialTodos: Todo[]) {
        this.todoList = initialTodos;
        makeAutoObservable(this, undefined, {autoBind: true})
    }
}