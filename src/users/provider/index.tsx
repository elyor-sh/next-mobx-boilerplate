"use client";

import React, {useState} from 'react';
import {UsersPageModule, UsersPageModuleContext} from "@/users/provider/config";
import {Users} from "@/users/api";
import {observer} from "mobx-react-lite";

type Props = {
  children: React.ReactNode;
  initialUsers: Users[];
}

export const UsersProvider = observer(({initialUsers, children}: Props) => {
  const [usersPageModule] = useState(() => new UsersPageModule(initialUsers))

  return (
    <UsersPageModuleContext value={usersPageModule}>
      {children}
    </UsersPageModuleContext>
  );
})

UsersProvider.displayName = "UsersProvider";

