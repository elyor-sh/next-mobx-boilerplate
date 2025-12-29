"use client";

import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useGlobalsContext } from "@/providers/global/config";
import { ValidatedQueryParams } from "@/shared/lib/query-params";
import { Todo, todoListQueryParamsSchema } from "@/todos/api";
import {
  TodosPageModule,
  TodosPageModuleContext,
} from "@/todos/provider/config";

type Props = {
  children: React.ReactNode;
  initialTodos: Todo[];
};

export const TodosProvider = observer(({ children, initialTodos }: Props) => {
  const { context } = useGlobalsContext();
  const [queryParams] = useState(() => {
    return new ValidatedQueryParams(
      context.appRouter.queryParams,
      context.appRouter.setQueryParams,
      todoListQueryParamsSchema,
    );
  });
  const [todosPageModule] = useState(
    () => new TodosPageModule(initialTodos, queryParams),
  );

  return (
    <TodosPageModuleContext value={todosPageModule}>
      {children}
    </TodosPageModuleContext>
  );
});

TodosProvider.displayName = "TodosProvider";
