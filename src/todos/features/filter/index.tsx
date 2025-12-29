"use client";

import { observer } from "mobx-react-lite";
import React from "react";

import { UsersSelect } from "@/pickers/user-select";
import { TodoListFilterVM } from "@/todos/features/filter/view-model";
import { useTodosPageModuleContext } from "@/todos/provider/config";

export const TodoListFilter = observer(() => {
  const { vm } = useTodosPageModuleContext(TodoListFilterVM);
  return (
    <>
      <UsersSelect
        value={vm.values.userId}
        onChange={(e) => vm.setValue({ userId: Number(e.target.value) })}
      />
    </>
  );
});

TodoListFilter.displayName = "TodoListFilter";
