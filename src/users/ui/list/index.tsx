"use client";

import React from 'react';
import {observer} from "mobx-react-lite";
import {useUsersPageModule} from "@/users/provider/config";
import Link from "next/link";
import {stringifyQueryParams} from "@/shared/lib/query-params";

export const UsersList = observer(() => {
  const {context: usersContext} = useUsersPageModule()

  return (
    <ul>
      {
          usersContext.usersModel.users.map((user, index) => (
          <li key={user.id}>
            <strong>{index + 1}. {user.name}</strong>
            <Link className="text-blue-500 pl-2" href={`/todos?${stringifyQueryParams({userId: user.id})}`} >
              View todos
            </Link>
          </li>
        ))
      }
    </ul>
  );
})

UsersList.displayName = "UsersList";