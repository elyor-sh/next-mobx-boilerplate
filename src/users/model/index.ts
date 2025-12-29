import { makeAutoObservable } from "mobx";

import { Users } from "@/users/api";

export class UsersModel {
  users: Users[] = [];

  constructor(initialUsers: Users[]) {
    this.users = initialUsers;
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  setUsers(users: Users[]) {
    this.users = users;
  }
}
