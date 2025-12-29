"use client";

import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { Users } from "@/users/api";
import {
  UsersPageModule,
  UsersPageModuleContext,
} from "@/users/provider/config";

type Props = {
  children: React.ReactNode;
  initialUsers: Users[];
};

export const UsersProvider = observer(({ initialUsers, children }: Props) => {
  const [usersPageModule] = useState(() => new UsersPageModule(initialUsers));

  return (
    <UsersPageModuleContext value={usersPageModule}>
      {children}
    </UsersPageModuleContext>
  );
});

UsersProvider.displayName = "UsersProvider";
