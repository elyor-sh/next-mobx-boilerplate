import {Users} from "@/users/api";
import {makeAutoObservable} from "mobx";

export class UsersModel {
  users: Users[] = [];

  constructor(initialUsers: Users[]) {
    this.users = initialUsers;
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  setUsers(users: Users[]) {
    this.users = users;
  }
}