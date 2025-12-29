import { createContext } from "react";

import { createUseStore } from "@/shared/lib/create-use-store";
import { Users } from "@/users/api";
import { UsersModel } from "@/users/model";

export class UsersPageModule {
  usersModel: UsersModel;

  constructor(initialUsers: Users[]) {
    this.usersModel = new UsersModel(initialUsers);
  }
}

export const UsersPageModuleContext = createContext<
  UsersPageModule | undefined
>(undefined);

export const useUsersPageModule = createUseStore(UsersPageModuleContext);
