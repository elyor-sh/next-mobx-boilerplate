import {UserSession} from "@/shared/lib/auth";
import {makeAutoObservable} from "mobx";

export class Session {
  user: UserSession | null;

  constructor(user: UserSession | null) {
    this.user = user;
    makeAutoObservable(this, undefined, {autoBind: true})
  }
}