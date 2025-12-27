"use client";

import React from 'react';
import {observer} from "mobx-react-lite";
import {useTodosPageModuleContext} from "@/todos/provider/config";
import {TodoListVM} from "@/todos/view-model";

export const TodosList = observer(() => {
    const {vm} = useTodosPageModuleContext(TodoListVM)

    if(vm.loadTodos.state.loading){
        return <div>Loading...</div>
    }

    return (
        <ul>
            {
                vm.context.todosModel.todoList.map((todo, index) => {
                    return (
                        <li key={todo.id}>
                            <span>{index + 1}.</span>
                            <span>{todo.title}</span>
                        </li>
                    )
                })
            }
        </ul>
    );
})

TodosList.displayName = "TodosList";