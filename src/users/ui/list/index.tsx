"use client";

import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

import { stringifyQueryParams } from "@/shared/lib/query-params";
import { useUsersPageModule } from "@/users/provider/config";

export const UsersList = observer(() => {
  const { context: usersContext } = useUsersPageModule();

  return (
    <ul>
      {usersContext.usersModel.users.map((user, index) => (
        <li key={user.id}>
          <strong>
            {index + 1}. {user.name}
          </strong>
          <Link
            className="text-blue-500 pl-2"
            href={`/todos?${stringifyQueryParams({ userId: user.id })}`}
          >
            View todos
          </Link>
        </li>
      ))}
    </ul>
  );
});

UsersList.displayName = "UsersList";
