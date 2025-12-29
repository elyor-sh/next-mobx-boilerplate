import { makeAutoObservable } from "mobx";

import { UserSession } from "@/shared/lib/auth";

export class Session {
  user: UserSession | null;

  constructor(user: UserSession | null) {
    this.user = user;
    makeAutoObservable(this, undefined, { autoBind: true });
  }
}
