"use client";

import React, {useState} from 'react';
import {Todo, todoListQueryParamsSchema} from "@/todos/api";
import {TodosPageModule, TodosPageModuleContext} from "@/todos/provider/config";
import {observer} from "mobx-react-lite";
import {useGlobalsContext} from "@/providers/global/config";
import {ValidatedQueryParams} from "@/shared/lib/query-params";

type Props = {
    children: React.ReactNode;
    initialTodos: Todo[];
}

export const TodosProvider = observer(({children, initialTodos}: Props) => {
    const {context} = useGlobalsContext()
    const [queryParams] = useState(() => {
        const parsedQueryParams = todoListQueryParamsSchema.parse(context.appRouter.queryParams)
        return new ValidatedQueryParams(parsedQueryParams, context.appRouter.setQueryParams)
    })
    const [todosPageModule] = useState(() => new TodosPageModule(initialTodos, queryParams))

    return (
        <TodosPageModuleContext value={todosPageModule}>
            {children}
        </TodosPageModuleContext>
    );
})

TodosProvider.displayName = "TodosProvider";